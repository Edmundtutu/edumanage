<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'role',
        'current_school_id',
        'status',
        'class_ids',
        'enrolled_courses',
        'enrolled_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'class_ids' => 'array',
            'enrolled_courses' => 'array',
            'enrolled_at' => 'array',
        ];
    }

    /**
     * Get the schools that belong to the user.
     */
    public function schools()
    {
        return $this->belongsToMany(School::class, 'user_school');
    }

    /**
     * Get the current school for the user.
     */
    public function currentSchool()
    {
        return $this->belongsTo(School::class, 'current_school_id');
    }

    /**
     * Get the classes taught by this user (if teacher).
     */
    public function teachingClasses()
    {
        return $this->hasMany(SchoolClass::class, 'teacher_id');
    }

    /**
     * Get the courses taught by this user (if teacher).
     */
    public function teachingCourses()
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    /**
     * Get the enrollments for this user (if student).
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    /**
     * Get the materials uploaded by this user.
     */
    public function uploadedMaterials()
    {
        return $this->hasMany(Material::class, 'uploaded_by');
    }

    /**
     * Check if user is a teacher.
     */
    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    /**
     * Check if user is a school admin.
     */
    public function isSchoolAdmin(): bool
    {
        return $this->role === 'school_admin';
    }

    /**
     * Check if user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    /**
     * Check if user is a student.
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    /**
     * Check if user can enroll students.
     */
    public function canEnrollStudents(): bool
    {
        return in_array($this->role, ['super_admin', 'school_admin', 'teacher']);
    }

    /**
     * Check if user can admit students.
     */
    public function canAdmitStudents(): bool
    {
        return in_array($this->role, ['super_admin', 'school_admin']);
    }
}
