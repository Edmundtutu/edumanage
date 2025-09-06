<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of enrollments
     */
    public function index(Request $request)
    {
        $query = Enrollment::with(['student', 'course', 'enrolledBy']);

        // Filter by course
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        // Filter by student
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->paginate(20);

        return response()->json($enrollments);
    }

    /**
     * Enroll a student in a course
     */
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        // Check if user can enroll students
        if (!$request->user()->canEnrollStudents()) {
            return response()->json([
                'message' => 'Unauthorized. You do not have permission to enroll students.'
            ], 403);
        }

        $student = User::find($request->student_id);
        $course = Course::find($request->course_id);

        // Verify student role
        if (!$student->isStudent()) {
            return response()->json([
                'message' => 'User is not a student'
            ], 400);
        }

        // Check if already enrolled
        $existingEnrollment = Enrollment::where('student_id', $request->student_id)
            ->where('course_id', $request->course_id)
            ->where('status', 'active')
            ->first();

        if ($existingEnrollment) {
            return response()->json([
                'message' => 'Student is already enrolled in this course'
            ], 400);
        }

        // Check course capacity
        if ($course->max_students) {
            $currentEnrollments = Enrollment::where('course_id', $request->course_id)
                ->where('status', 'active')
                ->count();

            if ($currentEnrollments >= $course->max_students) {
                return response()->json([
                    'message' => 'Course is at maximum capacity'
                ], 400);
            }
        }

        try {
            DB::beginTransaction();

            // Create enrollment record
            $enrollment = Enrollment::create([
                'student_id' => $request->student_id,
                'course_id' => $request->course_id,
                'enrolled_by' => $request->user()->id,
                'enrolled_at' => now(),
                'status' => 'active',
            ]);

            // Update student's enrolled courses
            $enrolledCourses = $student->enrolled_courses ?? [];
            if (!in_array($request->course_id, $enrolledCourses)) {
                $enrolledCourses[] = $request->course_id;
                $student->enrolled_courses = $enrolledCourses;
            }

            // Update student's enrolled_at
            $enrolledAt = $student->enrolled_at ?? [];
            $enrolledAt[$request->course_id] = now()->toDateString();
            $student->enrolled_at = $enrolledAt;
            $student->save();

            // Update course's enrolled students
            $enrolledStudents = $course->enrolled_students ?? [];
            if (!in_array($request->student_id, $enrolledStudents)) {
                $enrolledStudents[] = $request->student_id;
                $course->enrolled_students = $enrolledStudents;
                $course->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Student enrolled successfully',
                'enrollment' => $enrollment->load(['student', 'course', 'enrolledBy'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to enroll student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified enrollment
     */
    public function show(string $id)
    {
        $enrollment = Enrollment::with(['student', 'course', 'enrolledBy'])->find($id);

        if (!$enrollment) {
            return response()->json(['message' => 'Enrollment not found'], 404);
        }

        return response()->json($enrollment);
    }

    /**
     * Update enrollment status
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:active,dropped,completed',
        ]);

        $enrollment = Enrollment::find($id);

        if (!$enrollment) {
            return response()->json(['message' => 'Enrollment not found'], 404);
        }

        // Check permissions
        if (!$request->user()->canEnrollStudents()) {
            return response()->json([
                'message' => 'Unauthorized. You do not have permission to modify enrollments.'
            ], 403);
        }

        $enrollment->status = $request->status;
        $enrollment->save();

        return response()->json([
            'message' => 'Enrollment updated successfully',
            'enrollment' => $enrollment->load(['student', 'course', 'enrolledBy'])
        ]);
    }

    /**
     * Unenroll student from course (soft delete)
     */
    public function destroy(Request $request, string $id)
    {
        $enrollment = Enrollment::find($id);

        if (!$enrollment) {
            return response()->json(['message' => 'Enrollment not found'], 404);
        }

        // Check permissions
        if (!$request->user()->canEnrollStudents()) {
            return response()->json([
                'message' => 'Unauthorized. You do not have permission to unenroll students.'
            ], 403);
        }

        try {
            DB::beginTransaction();

            // Update enrollment status to dropped
            $enrollment->status = 'dropped';
            $enrollment->save();

            // Update student's enrolled courses
            $student = $enrollment->student;
            $enrolledCourses = $student->enrolled_courses ?? [];
            $enrolledCourses = array_filter($enrolledCourses, function($courseId) use ($enrollment) {
                return $courseId != $enrollment->course_id;
            });
            $student->enrolled_courses = array_values($enrolledCourses);

            // Remove from enrolled_at
            $enrolledAt = $student->enrolled_at ?? [];
            unset($enrolledAt[$enrollment->course_id]);
            $student->enrolled_at = $enrolledAt;
            $student->save();

            // Update course's enrolled students
            $course = $enrollment->course;
            $enrolledStudents = $course->enrolled_students ?? [];
            $enrolledStudents = array_filter($enrolledStudents, function($studentId) use ($enrollment) {
                return $studentId != $enrollment->student_id;
            });
            $course->enrolled_students = array_values($enrolledStudents);
            $course->save();

            DB::commit();

            return response()->json([
                'message' => 'Student unenrolled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Failed to unenroll student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Student self-enrollment
     */
    public function selfEnroll(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $student = $request->user();
        $course = Course::find($request->course_id);

        // Verify user is a student
        if (!$student->isStudent()) {
            return response()->json([
                'message' => 'Only students can self-enroll'
            ], 403);
        }

        // Check if course allows self-enrollment
        if (!$course->self_enrollment) {
            return response()->json([
                'message' => 'This course does not allow self-enrollment'
            ], 400);
        }

        // Create enrollment request with student as enrolledBy
        $enrollRequest = new Request([
            'student_id' => $student->id,
            'course_id' => $request->course_id,
        ]);
        $enrollRequest->setUserResolver(function() use ($student) {
            return $student;
        });

        return $this->store($enrollRequest);
    }
}