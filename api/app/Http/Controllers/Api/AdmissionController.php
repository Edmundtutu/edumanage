<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\School;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdmissionController extends Controller
{
    /**
     * Admit a single student to a school
     */
    public function admitStudent(Request $request, $schoolId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'class_name' => 'required|string',
            'password' => 'sometimes|string|min:6',
        ]);

        // Check if user can admit students
        if (!$request->user()->canAdmitStudents()) {
            return response()->json([
                'message' => 'Unauthorized. You do not have permission to admit students.'
            ], 403);
        }

        // Find school
        $school = School::find($schoolId);
        if (!$school) {
            return response()->json(['message' => 'School not found'], 404);
        }

        // Find class by name and school
        $class = SchoolClass::where('name', $request->class_name)
            ->where('school_id', $schoolId)
            ->first();

        if (!$class) {
            return response()->json([
                'message' => "Class '{$request->class_name}' not found in school"
            ], 404);
        }

        // Generate password if not provided
        $password = $request->password ?? 'student' . rand(100000, 999999);

        try {
            DB::beginTransaction();

            // Create student
            $student = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'username' => $request->username,
                'password' => $password,
                'role' => 'student',
                'current_school_id' => $schoolId,
                'class_ids' => [$class->id],
                'status' => 'active',
                'enrolled_courses' => [],
                'enrolled_at' => [],
            ]);

            // Create user-school relationship
            $student->schools()->attach($schoolId);

            DB::commit();

            return response()->json([
                'message' => 'Student admitted successfully',
                'student' => $student,
                'password' => $password, // Return password for admin to share with student
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to admit student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk admit students from CSV/Excel data
     */
    public function bulkAdmitStudents(Request $request, $schoolId)
    {
        $request->validate([
            'students' => 'required|array',
            'students.*.name' => 'required|string|max:255',
            'students.*.email' => 'required|email',
            'students.*.username' => 'required|string',
            'students.*.class_name' => 'required|string',
            'students.*.grade_level' => 'sometimes|string',
        ]);

        // Check if user can admit students
        if (!$request->user()->canAdmitStudents()) {
            return response()->json([
                'message' => 'Unauthorized. You do not have permission to admit students.'
            ], 403);
        }

        // Find school
        $school = School::find($schoolId);
        if (!$school) {
            return response()->json(['message' => 'School not found'], 404);
        }

        $studentsData = $request->students;
        $result = [
            'success' => [],
            'errors' => []
        ];

        foreach ($studentsData as $index => $studentData) {
            try {
                // Find class by name and school (case-insensitive)
                $class = SchoolClass::where('school_id', $schoolId)
                    ->whereRaw('LOWER(name) = ?', [strtolower($studentData['class_name'])])
                    ->first();

                if (!$class) {
                    $result['errors'][] = [
                        'row' => $index + 1,
                        'data' => $studentData,
                        'error' => "Class '{$studentData['class_name']}' not found in school"
                    ];
                    continue;
                }

                // Check for duplicate email or username
                $existingUser = User::where('email', $studentData['email'])
                    ->orWhere('username', $studentData['username'])
                    ->first();

                if ($existingUser) {
                    $result['errors'][] = [
                        'row' => $index + 1,
                        'data' => $studentData,
                        'error' => "User with email '{$studentData['email']}' or username '{$studentData['username']}' already exists"
                    ];
                    continue;
                }

                // Generate password
                $password = 'student' . rand(100000, 999999);

                DB::beginTransaction();

                // Create student
                $student = User::create([
                    'name' => $studentData['name'],
                    'email' => $studentData['email'],
                    'username' => $studentData['username'],
                    'password' => $password,
                    'role' => 'student',
                    'current_school_id' => $schoolId,
                    'class_ids' => [$class->id],
                    'status' => 'active',
                    'enrolled_courses' => [],
                    'enrolled_at' => [],
                ]);

                // Create user-school relationship
                $student->schools()->attach($schoolId);

                DB::commit();

                $result['success'][] = array_merge($studentData, [
                    'id' => $student->id,
                    'password' => $password
                ]);

            } catch (\Exception $e) {
                DB::rollback();
                $result['errors'][] = [
                    'row' => $index + 1,
                    'data' => $studentData,
                    'error' => 'Failed to create student: ' . $e->getMessage()
                ];
            }
        }

        return response()->json($result);
    }

    /**
     * Upload and process CSV/Excel file for bulk admission
     */
    public function uploadBulkFile(Request $request, $schoolId)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:2048',
        ]);

        // Check if user can admit students
        if (!$request->user()->canAdmitStudents()) {
            return response()->json([
                'message' => 'Unauthorized. You do not have permission to admit students.'
            ], 403);
        }

        try {
            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();
            
            $studentsData = [];

            if (in_array($extension, ['csv', 'txt'])) {
                // Process CSV file
                $csvData = file_get_contents($file->getRealPath());
                $lines = explode("\n", $csvData);
                
                // Skip header row
                $header = str_getcsv(array_shift($lines));
                
                foreach ($lines as $line) {
                    if (trim($line) === '') continue;
                    
                    $data = str_getcsv($line);
                    if (count($data) >= 4) {
                        $studentsData[] = [
                            'name' => $data[0] ?? '',
                            'email' => $data[1] ?? '',
                            'username' => $data[2] ?? '',
                            'class_name' => $data[3] ?? '',
                            'grade_level' => $data[4] ?? null,
                        ];
                    }
                }
            }
            // TODO: Add Excel processing with PhpSpreadsheet if needed

            // Process the students data
            $processRequest = new Request(['students' => $studentsData]);
            $processRequest->setUserResolver($request->getUserResolver());
            
            return $this->bulkAdmitStudents($processRequest, $schoolId);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to process file',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
