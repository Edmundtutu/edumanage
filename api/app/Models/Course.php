<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'school_id',
        'teacher_id',
        'class_ids',
        'status',
        'credits',
        'self_enrollment',
        'enrolled_students',
        'max_students',
    ];

    protected function casts(): array
    {
        return [
            'class_ids' => 'array',
            'enrolled_students' => 'array',
            'self_enrollment' => 'boolean',
        ];
    }

    /**
     * Get the school that owns the course.
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Get the teacher for the course.
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the materials for the course.
     */
    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    /**
     * Get the enrollments for the course.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the enrolled students for the course.
     */
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'student_id')
            ->wherePivot('status', 'active');
    }
}
