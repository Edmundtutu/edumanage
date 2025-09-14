<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'school_id',
        'grade_level',
        'teacher_id',
        'capacity',
        'description',
    ];

    /**
     * Get the school that owns the class.
     */
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    /**
     * Get the teacher for the class.
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the courses for the class.
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_classes', 'class_id', 'course_id');
    }
}
