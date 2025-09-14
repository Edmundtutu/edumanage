<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    /**
     * Display a listing of schools
     */
    public function index()
    {
        $schools = School::with(['admin'])->paginate(20);
        return response()->json($schools);
    }

    /**
     * Store a newly created school
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'admin_id' => 'sometimes|exists:users,id',
        ]);

        // Check permissions
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only super admins can create schools.'
            ], 403);
        }

        $school = School::create($request->all());

        return response()->json([
            'message' => 'School created successfully',
            'school' => $school
        ], 201);
    }

    /**
     * Display the specified school
     */
    public function show(string $id)
    {
        $school = School::with(['admin', 'classes', 'courses'])->find($id);

        if (!$school) {
            return response()->json(['message' => 'School not found'], 404);
        }

        return response()->json($school);
    }

    /**
     * Update the specified school
     */
    public function update(Request $request, string $id)
    {
        $school = School::find($id);

        if (!$school) {
            return response()->json(['message' => 'School not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'admin_id' => 'sometimes|exists:users,id',
            'status' => 'sometimes|in:active,inactive',
        ]);

        // Check permissions
        if (!$request->user()->isSuperAdmin() && !$request->user()->isSchoolAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can update schools.'
            ], 403);
        }

        $school->update($request->all());

        return response()->json([
            'message' => 'School updated successfully',
            'school' => $school
        ]);
    }

    /**
     * Remove the specified school
     */
    public function destroy(Request $request, string $id)
    {
        $school = School::find($id);

        if (!$school) {
            return response()->json(['message' => 'School not found'], 404);
        }

        // Check permissions
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only super admins can delete schools.'
            ], 403);
        }

        $school->delete();

        return response()->json([
            'message' => 'School deleted successfully'
        ]);
    }
}