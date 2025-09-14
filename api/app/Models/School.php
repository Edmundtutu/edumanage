<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'status',
        'admin_id',
    ];

    /**
     * Get the users that belong to the school.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_school');
    }

    /**
     * Get the admin for the school.
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the classes for the school.
     */
    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }

    /**
     * Get the courses for the school.
     */
    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
