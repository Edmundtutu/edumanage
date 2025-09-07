<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\School;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Super Admin
        $superAdmin = User::create([
            'name' => 'Edmond Tutu',
            'email' => 'edmond@system.com',
            'username' => 'edmond',
            'password' => Hash::make('admin123'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        // School Admins
        $schoolAdmins = [
            [
                'name' => 'Sarah Nalwanga',
                'email' => 'sarah@kampala.primary.ug',
                'username' => 'sarah.nalwanga',
                'password' => Hash::make('password123'),
                'role' => 'school_admin',
                'current_school_id' => 1,
                'status' => 'active',
            ],
            [
                'name' => 'James Kirunda',
                'email' => 'james@makerere.college.ug',
                'username' => 'james.k',
                'password' => Hash::make('admin789'),
                'role' => 'school_admin',
                'current_school_id' => 2,
                'status' => 'active',
            ],
            [
                'name' => 'Grace Namukasa',
                'email' => 'grace@jinja.primary.ug',
                'username' => 'grace.namukasa',
                'password' => Hash::make('admin456'),
                'role' => 'school_admin',
                'current_school_id' => 4,
                'status' => 'active',
            ],
            [
                'name' => 'David Wanyama',
                'email' => 'david@mbale.secondary.ug',
                'username' => 'david.wanyama',
                'password' => Hash::make('admin654'),
                'role' => 'school_admin',
                'current_school_id' => 5,
                'status' => 'active',
            ],
        ];

        foreach ($schoolAdmins as $admin) {
            $user = User::create($admin);
            // Assign to school
            $user->schools()->attach($admin['current_school_id']);
        }

        // Teachers
        $teachers = [
            [
                'name' => 'Mary Nakato',
                'email' => 'mary@kampala.primary.ug',
                'username' => 'mary.n',
                'password' => Hash::make('teacher123'),
                'role' => 'teacher',
                'current_school_id' => 1,
                'class_ids' => [1, 2, 6],
                'status' => 'active',
            ],
            [
                'name' => 'Peter Ssebugwawo',
                'email' => 'peter@makerere.college.ug',
                'username' => 'peter.ssebugwawo',
                'password' => Hash::make('teacher456'),
                'role' => 'teacher',
                'current_school_id' => 2,
                'class_ids' => [7, 8],
                'status' => 'active',
            ],
            [
                'name' => 'Rebecca Atukunda',
                'email' => 'rebecca@kampala.primary.ug',
                'username' => 'rebecca.atukunda',
                'password' => Hash::make('teacher789'),
                'role' => 'teacher',
                'current_school_id' => 1,
                'class_ids' => [3, 4, 5],
                'status' => 'active',
            ],
            [
                'name' => 'Moses Okello',
                'email' => 'moses@buddo.junior.ug',
                'username' => 'moses.okello',
                'password' => Hash::make('teacher321'),
                'role' => 'teacher',
                'current_school_id' => 3,
                'class_ids' => [11, 12],
                'status' => 'active',
            ],
            [
                'name' => 'Agnes Nambi',
                'email' => 'agnes@jinja.primary.ug',
                'username' => 'agnes.nambi',
                'password' => Hash::make('teacher654'),
                'role' => 'teacher',
                'current_school_id' => 4,
                'class_ids' => [16, 17],
                'status' => 'active',
            ],
            [
                'name' => 'Francis Lubega',
                'email' => 'francis@mbale.secondary.ug',
                'username' => 'francis.lubega',
                'password' => Hash::make('teacher987'),
                'role' => 'teacher',
                'current_school_id' => 5,
                'class_ids' => [20, 21],
                'status' => 'active',
            ],
        ];

        foreach ($teachers as $teacher) {
            $user = User::create($teacher);
            // Assign to school
            $user->schools()->attach($teacher['current_school_id']);
        }

        // Students
        $students = [
            [
                'name' => 'John Mukasa',
                'email' => 'john@kampala.primary.ug',
                'username' => 'john.m',
                'password' => Hash::make('student123'),
                'role' => 'student',
                'current_school_id' => 1,
                'class_ids' => [1],
                'enrolled_courses' => [1],
                'enrolled_at' => [1 => '2024-01-25'],
                'status' => 'active',
            ],
            [
                'name' => 'Esther Nakimuli',
                'email' => 'esther@makerere.college.ug',
                'username' => 'esther.nakimuli',
                'password' => Hash::make('student456'),
                'role' => 'student',
                'current_school_id' => 2,
                'class_ids' => [6],
                'enrolled_courses' => [5],
                'enrolled_at' => [5 => '2024-02-20'],
                'status' => 'active',
            ],
            [
                'name' => 'Andrew Kato',
                'email' => 'andrew@kampala.primary.ug',
                'username' => 'andrew.kato',
                'password' => Hash::make('student789'),
                'role' => 'student',
                'current_school_id' => 1,
                'class_ids' => [2],
                'enrolled_courses' => [1],
                'enrolled_at' => [1 => '2024-01-25'],
                'status' => 'active',
            ],
            [
                'name' => 'Patricia Namutebi',
                'email' => 'patricia@makerere.college.ug',
                'username' => 'patricia.namutebi',
                'password' => Hash::make('student321'),
                'role' => 'student',
                'current_school_id' => 2,
                'class_ids' => [7],
                'enrolled_courses' => [5, 7],
                'enrolled_at' => [5 => '2024-02-20', 7 => '2024-02-25'],
                'status' => 'active',
            ],
            [
                'name' => 'Samuel Obwoya',
                'email' => 'samuel@buddo.junior.ug',
                'username' => 'samuel.obwoya',
                'password' => Hash::make('student654'),
                'role' => 'student',
                'current_school_id' => 3,
                'class_ids' => [11],
                'enrolled_courses' => [9],
                'enrolled_at' => [9 => '2024-03-20'],
                'status' => 'active',
            ],
            [
                'name' => 'Charity Akello',
                'email' => 'charity@jinja.primary.ug',
                'username' => 'charity.akello',
                'password' => Hash::make('student987'),
                'role' => 'student',
                'current_school_id' => 4,
                'class_ids' => [16],
                'enrolled_courses' => [10],
                'enrolled_at' => [10 => '2024-01-15'],
                'status' => 'active',
            ],
            [
                'name' => 'Michael Tusiime',
                'email' => 'michael@mbale.secondary.ug',
                'username' => 'michael.tusiime',
                'password' => Hash::make('student147'),
                'role' => 'student',
                'current_school_id' => 5,
                'class_ids' => [20],
                'enrolled_courses' => [13],
                'enrolled_at' => [13 => '2024-02-05'],
                'status' => 'active',
            ],
            [
                'name' => 'Joan Namugga',
                'email' => 'joan@kampala.primary.ug',
                'username' => 'joan.namugga',
                'password' => Hash::make('student258'),
                'role' => 'student',
                'current_school_id' => 1,
                'class_ids' => [3],
                'enrolled_courses' => [2, 3],
                'enrolled_at' => [2 => '2024-03-05', 3 => '2024-01-30'],
                'status' => 'active',
            ],
            [
                'name' => 'Simon Nsubuga',
                'email' => 'simon@makerere.college.ug',
                'username' => 'simon.nsubuga',
                'password' => Hash::make('student369'),
                'role' => 'student',
                'current_school_id' => 2,
                'class_ids' => [8],
                'enrolled_courses' => [6],
                'enrolled_at' => [6 => '2024-03-20'],
                'status' => 'active',
            ],
            [
                'name' => 'Immaculate Nakabuye',
                'email' => 'immaculate@buddo.junior.ug',
                'username' => 'immaculate.nakabuye',
                'password' => Hash::make('student741'),
                'role' => 'student',
                'current_school_id' => 3,
                'class_ids' => [12],
                'enrolled_courses' => [9],
                'enrolled_at' => [9 => '2024-03-20'],
                'status' => 'active',
            ],
        ];

        foreach ($students as $student) {
            $user = User::create($student);
            // Assign to school
            $user->schools()->attach($student['current_school_id']);
        }
    }
}