<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            // Kampala Primary School (ID: 1)
            [
                'name' => 'Mathematics',
                'description' => 'Introduction to numeracy concepts including counting, addition, subtraction, multiplication, and division. Foundation for PLE mathematics preparation.',
                'school_id' => 1,
                'teacher_id' => 10,
                'class_ids' => [1, 2],
                'self_enrollment' => true,
                'enrolled_students' => [31, 33],
                'max_students' => 30,
                'status' => 'active',
            ],
            [
                'name' => 'English Language',
                'description' => 'Reading, writing, speaking, and listening skills development. Grammar, vocabulary, and comprehension for effective communication in English.',
                'school_id' => 1,
                'teacher_id' => 10,
                'class_ids' => [3, 4],
                'self_enrollment' => false,
                'enrolled_students' => [38],
                'max_students' => 25,
                'status' => 'active',
            ],
            [
                'name' => 'Social Studies',
                'description' => 'Study of Ugandan history, geography, civics, and culture. Understanding of national identity, government structures, and social responsibilities.',
                'school_id' => 1,
                'teacher_id' => 12,
                'class_ids' => [4, 5],
                'self_enrollment' => true,
                'enrolled_students' => [38, 43],
                'max_students' => 28,
                'status' => 'active',
            ],
            [
                'name' => 'Integrated Science',
                'description' => 'Basic science concepts covering plants, animals, human body, and environmental science. Hands-on experiments and observations.',
                'school_id' => 1,
                'teacher_id' => 12,
                'class_ids' => [5],
                'self_enrollment' => false,
                'enrolled_students' => [43],
                'max_students' => 20,
                'status' => 'active',
            ],

            // Makerere College School (ID: 2)
            [
                'name' => 'Biology',
                'description' => 'Study of living organisms, cell structure, genetics, ecology, and human biology. Laboratory practicals and field work included.',
                'school_id' => 2,
                'teacher_id' => 11,
                'class_ids' => [6, 7],
                'self_enrollment' => true,
                'enrolled_students' => [32, 34],
                'max_students' => 24,
                'status' => 'active',
            ],
            [
                'name' => 'Chemistry',
                'description' => 'Introduction to chemical principles, atomic structure, chemical bonding, and reactions. Laboratory experiments and safety protocols.',
                'school_id' => 2,
                'teacher_id' => 10,
                'class_ids' => [8, 9],
                'self_enrollment' => false,
                'enrolled_students' => [39],
                'max_students' => 22,
                'status' => 'active',
            ],
            [
                'name' => 'Advanced Mathematics',
                'description' => 'Algebra, geometry, trigonometry, and calculus basics. Preparation for UACE mathematics and university entrance requirements.',
                'school_id' => 2,
                'teacher_id' => 11,
                'class_ids' => [9, 10],
                'self_enrollment' => true,
                'enrolled_students' => [34, 44],
                'max_students' => 26,
                'status' => 'active',
            ],

            // Buddo Junior School (ID: 3)
            [
                'name' => 'Advanced Level Mathematics',
                'description' => 'Pure mathematics and applied mathematics for UACE. Covers calculus, statistics, and mechanics for university preparation.',
                'school_id' => 3,
                'teacher_id' => 13,
                'class_ids' => [14, 15],
                'self_enrollment' => false,
                'enrolled_students' => [45],
                'max_students' => 18,
                'status' => 'active',
            ],
            [
                'name' => 'Literature in English',
                'description' => 'Study of poetry, drama, and prose from African, European, and American authors. Critical analysis and creative writing skills.',
                'school_id' => 3,
                'teacher_id' => 13,
                'class_ids' => [11, 12, 13],
                'self_enrollment' => true,
                'enrolled_students' => [35, 40],
                'max_students' => 30,
                'status' => 'active',
            ],

            // Jinja Primary School (ID: 4)
            [
                'name' => 'Primary Mathematics',
                'description' => 'Basic numeracy skills for young learners. Numbers, shapes, measurements, and simple problem solving using local contexts.',
                'school_id' => 4,
                'teacher_id' => 14,
                'class_ids' => [16, 17, 18],
                'self_enrollment' => false,
                'enrolled_students' => [36],
                'max_students' => 25,
                'status' => 'active',
            ],
            [
                'name' => 'Luganda Language',
                'description' => 'Local language instruction in Luganda. Reading, writing, speaking, and cultural appreciation of Buganda traditions.',
                'school_id' => 4,
                'teacher_id' => 14,
                'class_ids' => [18, 19],
                'self_enrollment' => false,
                'enrolled_students' => [41],
                'max_students' => 22,
                'status' => 'active',
            ],

            // Mbale Secondary School (ID: 5)
            [
                'name' => 'Ordinary Level Mathematics',
                'description' => 'Comprehensive mathematics covering algebra, geometry, trigonometry, and statistics. Preparation for UCE examination.',
                'school_id' => 5,
                'teacher_id' => 15,
                'class_ids' => [22, 23],
                'self_enrollment' => true,
                'enrolled_students' => [],
                'max_students' => 28,
                'status' => 'active',
            ],
            [
                'name' => 'Geography',
                'description' => 'Physical and human geography of Uganda, East Africa, and the world. Map reading, climate, population, and economic activities.',
                'school_id' => 5,
                'teacher_id' => 15,
                'class_ids' => [20, 21],
                'self_enrollment' => true,
                'enrolled_students' => [37, 42],
                'max_students' => 26,
                'status' => 'active',
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}