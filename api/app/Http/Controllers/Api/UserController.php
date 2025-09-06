<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by school
        if ($request->has('school_id')) {
            $query->whereHas('schools', function($q) use ($request) {
                $q->where('school_id', $request->school_id);
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->paginate(20);

        return response()->json($users);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:6',
            'role' => 'required|in:super_admin,school_admin,teacher,student',
            'current_school_id' => 'sometimes|exists:schools,id',
        ]);

        // Check permissions
        if (!$request->user()->isSuperAdmin() && !$request->user()->isSchoolAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can create users.'
            ], 403);
        }

        $user = User::create($request->all());

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Display the specified user
     */
    public function show(string $id)
    {
        $user = User::with(['schools', 'currentSchool'])->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'username' => 'sometimes|string|unique:users,username,' . $id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:super_admin,school_admin,teacher,student',
            'status' => 'sometimes|in:active,inactive',
        ]);

        // Check permissions
        if (!$request->user()->isSuperAdmin() && !$request->user()->isSchoolAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins can update users.'
            ], 403);
        }

        $user->update($request->all());

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified user
     */
    public function destroy(Request $request, string $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check permissions
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Only super admins can delete users.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }
}