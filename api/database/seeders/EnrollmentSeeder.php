<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Enrollment;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $enrollments = [
            ['student_id' => 31, 'course_id' => 1, 'enrolled_by' => 10, 'enrolled_at' => '2024-01-25 10:00:00', 'status' => 'active'],
            ['student_id' => 33, 'course_id' => 1, 'enrolled_by' => 10, 'enrolled_at' => '2024-01-25 10:00:00', 'status' => 'active'],
            ['student_id' => 32, 'course_id' => 5, 'enrolled_by' => 11, 'enrolled_at' => '2024-02-20 14:30:00', 'status' => 'active'],
            ['student_id' => 34, 'course_id' => 5, 'enrolled_by' => 11, 'enrolled_at' => '2024-02-20 14:30:00', 'status' => 'active'],
            ['student_id' => 34, 'course_id' => 7, 'enrolled_by' => 11, 'enrolled_at' => '2024-02-25 09:15:00', 'status' => 'active'],
            ['student_id' => 35, 'course_id' => 9, 'enrolled_by' => 13, 'enrolled_at' => '2024-03-20 11:45:00', 'status' => 'active'],
            ['student_id' => 36, 'course_id' => 10, 'enrolled_by' => 14, 'enrolled_at' => '2024-01-15 08:30:00', 'status' => 'active'],
            ['student_id' => 37, 'course_id' => 13, 'enrolled_by' => 15, 'enrolled_at' => '2024-02-05 13:20:00', 'status' => 'active'],
            ['student_id' => 38, 'course_id' => 2, 'enrolled_by' => 10, 'enrolled_at' => '2024-03-05 15:00:00', 'status' => 'active'],
            ['student_id' => 38, 'course_id' => 3, 'enrolled_by' => 12, 'enrolled_at' => '2024-01-30 12:00:00', 'status' => 'active'],
            ['student_id' => 39, 'course_id' => 6, 'enrolled_by' => 10, 'enrolled_at' => '2024-03-20 16:30:00', 'status' => 'active'],
            ['student_id' => 40, 'course_id' => 9, 'enrolled_by' => 13, 'enrolled_at' => '2024-03-20 11:45:00', 'status' => 'active'],
            ['student_id' => 41, 'course_id' => 11, 'enrolled_by' => 14, 'enrolled_at' => '2024-01-20 10:15:00', 'status' => 'active'],
            ['student_id' => 42, 'course_id' => 13, 'enrolled_by' => 15, 'enrolled_at' => '2024-02-05 13:20:00', 'status' => 'active'],
            ['student_id' => 43, 'course_id' => 3, 'enrolled_by' => 12, 'enrolled_at' => '2024-01-30 12:00:00', 'status' => 'active'],
            ['student_id' => 43, 'course_id' => 4, 'enrolled_by' => 12, 'enrolled_at' => '2024-02-15 14:45:00', 'status' => 'active'],
            ['student_id' => 44, 'course_id' => 7, 'enrolled_by' => 11, 'enrolled_at' => '2024-02-25 09:15:00', 'status' => 'active'],
            ['student_id' => 45, 'course_id' => 8, 'enrolled_by' => 13, 'enrolled_at' => '2024-03-15 11:00:00', 'status' => 'active'],
        ];

        foreach ($enrollments as $enrollment) {
            Enrollment::create($enrollment);
        }
    }
}