<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\Course;
use App\Models\Material;
use App\Models\Enrollment;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create schools
        $schools = [
            [
                'id' => 1,
                'name' => 'Kampala Primary School',
                'address' => 'Plot 123, Kampala Road, Central Division, Kampala',
                'created_at' => '2024-01-15',
            ],
            [
                'id' => 2,
                'name' => 'Makerere College School',
                'address' => 'Makerere Hill, Kawempe Division, Kampala',
                'created_at' => '2024-02-20',
            ],
            [
                'id' => 3,
                'name' => 'Buddo Junior School',
                'address' => 'Buddo, Wakiso District, Central Region',
                'created_at' => '2024-03-10',
            ],
            [
                'id' => 4,
                'name' => 'Jinja Primary School',
                'address' => 'Jinja Main Street, Jinja Municipality, Eastern Region',
                'created_at' => '2023-08-15',
            ],
            [
                'id' => 5,
                'name' => 'Mbale Secondary School',
                'address' => 'Republic Street, Mbale Municipality, Eastern Region',
                'created_at' => '2023-09-01',
            ],
        ];

        foreach ($schools as $school) {
            School::create($school);
        }

        // Create users
        $users = [
            // Super Admin
            [
                'id' => 1,
                'name' => 'Edmond Tutu',
                'email' => 'edmond@system.com',
                'username' => 'edmond',
                'password' => 'admin123',
                'role' => 'super_admin',
            ],
            // School Admins
            [
                'id' => 2,
                'name' => 'Sarah Nalwanga',
                'email' => 'sarah@kampala.primary.ug',
                'username' => 'sarah.nalwanga',
                'password' => 'password123',
                'role' => 'school_admin',
                'current_school_id' => 1,
            ],
            [
                'id' => 3,
                'name' => 'James Kirunda',
                'email' => 'james@makerere.college.ug',
                'username' => 'james.k',
                'password' => 'admin789',
                'role' => 'school_admin',
                'current_school_id' => 2,
            ],
            // Teachers
            [
                'id' => 10,
                'name' => 'Mary Nakato',
                'email' => 'mary@kampala.primary.ug',
                'username' => 'mary.n',
                'password' => 'teacher123',
                'role' => 'teacher',
                'current_school_id' => 1,
                'class_ids' => [1, 2],
            ],
            [
                'id' => 11,
                'name' => 'Peter Ssebugwawo',
                'email' => 'peter@makerere.college.ug',
                'username' => 'peter.ssebugwawo',
                'password' => 'teacher456',
                'role' => 'teacher',
                'current_school_id' => 2,
                'class_ids' => [6, 7],
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create user-school relationships
        $userSchoolRelations = [
            ['user_id' => 2, 'school_id' => 1],
            ['user_id' => 3, 'school_id' => 2],
            ['user_id' => 10, 'school_id' => 1],
            ['user_id' => 11, 'school_id' => 2],
        ];

        foreach ($userSchoolRelations as $relation) {
            \DB::table('user_school')->insert($relation);
        }

        // Create classes
        $classes = [
            ['id' => 1, 'name' => 'Primary 1 Red', 'school_id' => 1, 'grade_level' => 'Primary 1', 'created_at' => '2024-01-20'],
            ['id' => 2, 'name' => 'Primary 1 Blue', 'school_id' => 1, 'grade_level' => 'Primary 1', 'created_at' => '2024-01-20'],
            ['id' => 3, 'name' => 'Primary 2 Green', 'school_id' => 1, 'grade_level' => 'Primary 2', 'created_at' => '2024-01-20'],
            ['id' => 6, 'name' => 'Senior 1 Alpha', 'school_id' => 2, 'grade_level' => 'Senior 1', 'created_at' => '2024-02-15'],
            ['id' => 7, 'name' => 'Senior 1 Beta', 'school_id' => 2, 'grade_level' => 'Senior 1', 'created_at' => '2024-02-15'],
        ];

        foreach ($classes as $class) {
            SchoolClass::create($class);
        }

        // Create student users
        $students = [
            [
                'id' => 31,
                'name' => 'John Mukasa',
                'email' => 'john@kampala.primary.ug',
                'username' => 'john.m',
                'password' => 'student123',
                'role' => 'student',
                'current_school_id' => 1,
                'class_ids' => [1],
                'enrolled_courses' => [1],
                'enrolled_at' => ['1' => '2024-01-25'],
            ],
            [
                'id' => 32,
                'name' => 'Esther Nakimuli',
                'email' => 'esther@makerere.college.ug',
                'username' => 'esther.nakimuli',
                'password' => 'student456',
                'role' => 'student',
                'current_school_id' => 2,
                'class_ids' => [6],
                'enrolled_courses' => [5],
                'enrolled_at' => ['5' => '2024-02-20'],
            ],
        ];

        foreach ($students as $student) {
            User::create($student);
        }

        // Create student-school relationships
        $studentSchoolRelations = [
            ['user_id' => 31, 'school_id' => 1],
            ['user_id' => 32, 'school_id' => 2],
        ];

        foreach ($studentSchoolRelations as $relation) {
            \DB::table('user_school')->insert($relation);
        }

        // Create courses
        $courses = [
            [
                'id' => 1,
                'name' => 'Mathematics',
                'description' => 'Introduction to numeracy concepts including counting, addition, subtraction, multiplication, and division.',
                'school_id' => 1,
                'teacher_id' => 10,
                'class_ids' => [1, 2],
                'created_at' => '2024-01-20',
                'self_enrollment' => true,
                'enrolled_students' => [31],
                'max_students' => 30,
            ],
            [
                'id' => 5,
                'name' => 'Biology',
                'description' => 'Study of living organisms, cell structure, genetics, ecology, and human biology.',
                'school_id' => 2,
                'teacher_id' => 11,
                'class_ids' => [6, 7],
                'created_at' => '2024-02-15',
                'self_enrollment' => true,
                'enrolled_students' => [32],
                'max_students' => 24,
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }

        // Create materials
        $materials = [
            [
                'id' => 1,
                'title' => 'Primary Mathematics Workbook',
                'description' => 'Complete guide to primary mathematics with local examples',
                'file_type' => 'pdf',
                'file_url' => '/materials/primary-math-workbook.pdf',
                'course_id' => 1,
                'uploaded_by' => 10,
                'created_at' => '2024-01-25',
            ],
            [
                'id' => 9,
                'title' => 'Biology Diagrams and Charts',
                'description' => 'Detailed biological diagrams with labels',
                'file_type' => 'pdf',
                'file_url' => '/materials/biology-diagrams.pdf',
                'course_id' => 5,
                'uploaded_by' => 11,
                'created_at' => '2024-02-20',
            ],
        ];

        foreach ($materials as $material) {
            Material::create($material);
        }

        // Create enrollments
        $enrollments = [
            [
                'id' => 1,
                'student_id' => 31,
                'course_id' => 1,
                'enrolled_by' => 10,
                'enrolled_at' => '2024-01-25',
                'status' => 'active',
            ],
            [
                'id' => 3,
                'student_id' => 32,
                'course_id' => 5,
                'enrolled_by' => 11,
                'enrolled_at' => '2024-02-20',
                'status' => 'active',
            ],
        ];

        foreach ($enrollments as $enrollment) {
            Enrollment::create($enrollment);
        }
    }
}