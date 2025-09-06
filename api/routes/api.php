<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\AdmissionController;

// Public authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/login-username', [AuthController::class, 'loginWithUsername']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Authentication routes
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/logout-all', [AuthController::class, 'logoutAll']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Resource routes
    Route::apiResource('users', UserController::class);
    Route::apiResource('schools', SchoolController::class);
    Route::apiResource('classes', ClassController::class);
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('materials', MaterialController::class);
    Route::apiResource('enrollments', EnrollmentController::class);

    // Admission routes
    Route::post('/schools/{school}/admit', [AdmissionController::class, 'admitStudent']);
    Route::post('/schools/{school}/admit/bulk', [AdmissionController::class, 'bulkAdmitStudents']);
    Route::post('/schools/{school}/admit/bulk-file', [AdmissionController::class, 'uploadBulkFile']);

    // Enrollment routes
    Route::post('/enrollments/self-enroll', [EnrollmentController::class, 'selfEnroll']);

    // Additional utility routes
    Route::get('/schools/{school}/classes', function($schoolId) {
        return \App\Models\SchoolClass::where('school_id', $schoolId)->get();
    });
    Route::get('/schools/{school}/courses', function($schoolId) {
        return \App\Models\Course::where('school_id', $schoolId)->with(['teacher'])->get();
    });
    Route::get('/courses/{course}/materials', function($courseId) {
        return \App\Models\Material::where('course_id', $courseId)->with(['uploader'])->get();
    });
    
    // Material download route
    Route::get('/materials/{material}/download', [MaterialController::class, 'download']);
});

// Legacy route for compatibility
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
