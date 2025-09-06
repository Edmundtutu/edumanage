<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    /**
     * Display a listing of classes
     */
    public function index(Request $request)
    {
        $query = SchoolClass::with(['school', 'teacher']);

        // Filter by school
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        $classes = $query->paginate(20);

        return response()->json($classes);
    }

    /**
     * Store a newly created class
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'school_id' => 'required|exists:schools,id',
            'grade_level' => 'required|string|max:255',
            'teacher_id' => 'sometimes|exists:users,id',
            'capacity' => 'sometimes|integer|min:1',
            'description' => 'sometimes|string',
        ]);

        // Check permissions
        if (!$request->user()->isSuperAdmin() && !$request->user()->isSchoolAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can create classes.'
            ], 403);
        }

        $class = SchoolClass::create($request->all());

        return response()->json([
            'message' => 'Class created successfully',
            'class' => $class->load(['school', 'teacher'])
        ], 201);
    }

    /**
     * Display the specified class
     */
    public function show(string $id)
    {
        $class = SchoolClass::with(['school', 'teacher', 'courses'])->find($id);

        if (!$class) {
            return response()->json(['message' => 'Class not found'], 404);
        }

        return response()->json($class);
    }

    /**
     * Update the specified class
     */
    public function update(Request $request, string $id)
    {
        $class = SchoolClass::find($id);

        if (!$class) {
            return response()->json(['message' => 'Class not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'grade_level' => 'sometimes|string|max:255',
            'teacher_id' => 'sometimes|exists:users,id',
            'capacity' => 'sometimes|integer|min:1',
            'description' => 'sometimes|string',
        ]);

        // Check permissions
        if (!$request->user()->isSuperAdmin() && !$request->user()->isSchoolAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can update classes.'
            ], 403);
        }

        $class->update($request->all());

        return response()->json([
            'message' => 'Class updated successfully',
            'class' => $class->load(['school', 'teacher'])
        ]);
    }

    /**
     * Remove the specified class
     */
    public function destroy(Request $request, string $id)
    {
        $class = SchoolClass::find($id);

        if (!$class) {
            return response()->json(['message' => 'Class not found'], 404);
        }

        // Check permissions
        if (!$request->user()->isSuperAdmin() && !$request->user()->isSchoolAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can delete classes.'
            ], 403);
        }

        $class->delete();

        return response()->json([
            'message' => 'Class deleted successfully'
        ]);
    }
}
