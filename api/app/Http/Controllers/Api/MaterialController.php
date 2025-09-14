<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    /**
     * Display a listing of materials
     */
    public function index(Request $request)
    {
        $query = Material::with(['course', 'uploader']);

        // Filter by course
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        // Filter by uploader
        if ($request->has('uploaded_by')) {
            $query->where('uploaded_by', $request->uploaded_by);
        }

        // Filter by file type
        if ($request->has('file_type')) {
            $query->where('file_type', $request->file_type);
        }

        $materials = $query->paginate(20);

        return response()->json($materials);
    }

    /**
     * Store a newly created material
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'course_id' => 'required|exists:courses,id',
            'file' => 'required|file|mimes:pdf,doc,docx,mp4,avi,mov|max:102400', // 100MB max
        ]);

        // Check permissions
        if (!$request->user()->canEnrollStudents()) {
            return response()->json([
                'message' => 'Unauthorized. Only admins and teachers can upload materials.'
            ], 403);
        }

        // Handle file upload
        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('materials', $fileName, 'public');
        
        // Determine file type
        $extension = strtolower($file->getClientOriginalExtension());
        $fileType = 'document';
        if (in_array($extension, ['pdf'])) {
            $fileType = 'pdf';
        } elseif (in_array($extension, ['mp4', 'avi', 'mov'])) {
            $fileType = 'video';
        }

        $material = Material::create([
            'title' => $request->title,
            'description' => $request->description,
            'course_id' => $request->course_id,
            'uploaded_by' => $request->user()->id,
            'file_type' => $fileType,
            'file_url' => $filePath,
            'file_size' => $this->formatFileSize($file->getSize()),
        ]);

        return response()->json([
            'message' => 'Material uploaded successfully',
            'material' => $material->load(['course', 'uploader'])
        ], 201);
    }

    /**
     * Display the specified material
     */
    public function show(string $id)
    {
        $material = Material::with(['course', 'uploader'])->find($id);

        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }

        // Increment download count
        $material->increment('downloads');

        return response()->json($material);
    }

    /**
     * Update the specified material
     */
    public function update(Request $request, string $id)
    {
        $material = Material::find($id);

        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
        ]);

        // Check permissions
        if (!$request->user()->canEnrollStudents() && $material->uploaded_by !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only update your own materials.'
            ], 403);
        }

        $material->update($request->only(['title', 'description']));

        return response()->json([
            'message' => 'Material updated successfully',
            'material' => $material->load(['course', 'uploader'])
        ]);
    }

    /**
     * Remove the specified material
     */
    public function destroy(Request $request, string $id)
    {
        $material = Material::find($id);

        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }

        // Check permissions
        if (!$request->user()->canEnrollStudents() && $material->uploaded_by !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized. You can only delete your own materials.'
            ], 403);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($material->file_url)) {
            Storage::disk('public')->delete($material->file_url);
        }

        $material->delete();

        return response()->json([
            'message' => 'Material deleted successfully'
        ]);
    }

    /**
     * Download material file
     */
    public function download(string $id)
    {
        $material = Material::find($id);

        if (!$material) {
            return response()->json(['message' => 'Material not found'], 404);
        }

        if (!Storage::disk('public')->exists($material->file_url)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Increment download count
        $material->increment('downloads');

        return Storage::disk('public')->download($material->file_url);
    }

    /**
     * Format file size in human readable format
     */
    private function formatFileSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
