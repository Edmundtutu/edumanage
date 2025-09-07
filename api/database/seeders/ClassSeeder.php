<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SchoolClass;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            // Kampala Primary School (ID: 1)
            ['name' => 'Primary 1 Red', 'school_id' => 1, 'grade_level' => 'Primary 1', 'teacher_id' => 10],
            ['name' => 'Primary 1 Blue', 'school_id' => 1, 'grade_level' => 'Primary 1', 'teacher_id' => 10],
            ['name' => 'Primary 2 Green', 'school_id' => 1, 'grade_level' => 'Primary 2', 'teacher_id' => 12],
            ['name' => 'Primary 3 Yellow', 'school_id' => 1, 'grade_level' => 'Primary 3', 'teacher_id' => 12],
            ['name' => 'Primary 4 Orange', 'school_id' => 1, 'grade_level' => 'Primary 4', 'teacher_id' => 12],

            // Makerere College School (ID: 2)
            ['name' => 'Senior 1 Alpha', 'school_id' => 2, 'grade_level' => 'Senior 1', 'teacher_id' => 10],
            ['name' => 'Senior 1 Beta', 'school_id' => 2, 'grade_level' => 'Senior 1', 'teacher_id' => 11],
            ['name' => 'Senior 2 Alpha', 'school_id' => 2, 'grade_level' => 'Senior 2', 'teacher_id' => 11],
            ['name' => 'Senior 3 Alpha', 'school_id' => 2, 'grade_level' => 'Senior 3', 'teacher_id' => 11],
            ['name' => 'Senior 4 Alpha', 'school_id' => 2, 'grade_level' => 'Senior 4', 'teacher_id' => 11],

            // Buddo Junior School (ID: 3)
            ['name' => 'Senior 5 Arts', 'school_id' => 3, 'grade_level' => 'Senior 5', 'teacher_id' => 13],
            ['name' => 'Senior 5 Sciences', 'school_id' => 3, 'grade_level' => 'Senior 5', 'teacher_id' => 13],
            ['name' => 'Senior 6 Arts', 'school_id' => 3, 'grade_level' => 'Senior 6', 'teacher_id' => 13],
            ['name' => 'Senior 6 Sciences', 'school_id' => 3, 'grade_level' => 'Senior 6', 'teacher_id' => 13],
            ['name' => 'Senior 4 Science', 'school_id' => 3, 'grade_level' => 'Senior 4', 'teacher_id' => 13],

            // Jinja Primary School (ID: 4)
            ['name' => 'Baby Class A', 'school_id' => 4, 'grade_level' => 'Baby Class', 'teacher_id' => 14],
            ['name' => 'Baby Class B', 'school_id' => 4, 'grade_level' => 'Baby Class', 'teacher_id' => 14],
            ['name' => 'Primary 1 Eagles', 'school_id' => 4, 'grade_level' => 'Primary 1', 'teacher_id' => 14],
            ['name' => 'Primary 2 Lions', 'school_id' => 4, 'grade_level' => 'Primary 2', 'teacher_id' => 14],

            // Mbale Secondary School (ID: 5)
            ['name' => 'Senior 1 A', 'school_id' => 5, 'grade_level' => 'Senior 1', 'teacher_id' => 15],
            ['name' => 'Senior 1 B', 'school_id' => 5, 'grade_level' => 'Senior 1', 'teacher_id' => 15],
            ['name' => 'Senior 2 A', 'school_id' => 5, 'grade_level' => 'Senior 2', 'teacher_id' => 15],
            ['name' => 'Senior 3 A', 'school_id' => 5, 'grade_level' => 'Senior 3', 'teacher_id' => 15],
        ];

        foreach ($classes as $class) {
            SchoolClass::create($class);
        }
    }
}