<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of courses
     */
    public function index(Request $request)
    {
        $query = Course::with(['school', 'teacher']);

        // Filter by school
        if ($request->has('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $courses = $query->paginate(20);

        return response()->json($courses);
    }

    /**
     * Store a newly created course
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'school_id' => 'required|exists:schools,id',
            'teacher_id' => 'sometimes|exists:users,id',
            'class_ids' => 'sometimes|array',
            'credits' => 'sometimes|integer',
            'self_enrollment' => 'sometimes|boolean',
            'max_students' => 'sometimes|integer',
        ]);

        // Check permissions
        if (!$request->user()->canEnrollStudents()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins and teachers can create courses.'
            ], 403);
        }

        $course = Course::create($request->all());

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course->load(['school', 'teacher'])
        ], 201);
    }

    /**
     * Display the specified course
     */
    public function show(string $id)
    {
        $course = Course::with(['school', 'teacher', 'materials', 'enrollments.student'])->find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        return response()->json($course);
    }

    /**
     * Update the specified course
     */
    public function update(Request $request, string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'teacher_id' => 'sometimes|exists:users,id',
            'class_ids' => 'sometimes|array',
            'status' => 'sometimes|in:active,inactive',
            'credits' => 'sometimes|integer',
            'self_enrollment' => 'sometimes|boolean',
            'max_students' => 'sometimes|integer',
        ]);

        // Check permissions
        if (!$request->user()->canEnrollStudents()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins and teachers can update courses.'
            ], 403);
        }

        $course->update($request->all());

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course->load(['school', 'teacher'])
        ]);
    }

    /**
     * Remove the specified course
     */
    public function destroy(Request $request, string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Check permissions
        if (!$request->user()->canEnrollStudents()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins and teachers can delete courses.'
            ], 403);
        }

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }
}