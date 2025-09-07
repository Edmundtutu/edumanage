<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Material;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materials = [
            // Materials for Kampala Primary School courses
            [
                'title' => 'Primary Mathematics Workbook',
                'description' => 'Complete guide to primary mathematics with local examples and PLE preparation exercises',
                'file_type' => 'pdf',
                'file_url' => '/materials/primary-math-workbook.pdf',
                'course_id' => 1,
                'uploaded_by' => 10,
                'file_size' => '2.5 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Number Games and Activities',
                'description' => 'Fun mathematical activities using Ugandan coins, fruits, and everyday objects',
                'file_type' => 'pdf',
                'file_url' => '/materials/number-games.pdf',
                'course_id' => 1,
                'uploaded_by' => 10,
                'file_size' => '1.8 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Mathematics Teaching Videos',
                'description' => 'Video lessons in English and Luganda for primary mathematics concepts',
                'file_type' => 'video',
                'file_url' => '/materials/math-videos.mp4',
                'course_id' => 1,
                'uploaded_by' => 10,
                'file_size' => '45.2 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'English Grammar Guide',
                'description' => 'Comprehensive English grammar with Ugandan context examples and exercises',
                'file_type' => 'document',
                'file_url' => '/materials/english-grammar.docx',
                'course_id' => 2,
                'uploaded_by' => 10,
                'file_size' => '3.1 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Reading Comprehension Passages',
                'description' => 'Reading passages about Ugandan culture, history, and daily life for comprehension practice',
                'file_type' => 'pdf',
                'file_url' => '/materials/reading-passages.pdf',
                'course_id' => 2,
                'uploaded_by' => 10,
                'file_size' => '2.2 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'History of Uganda',
                'description' => 'Comprehensive guide to Ugandan history from pre-colonial times to independence',
                'file_type' => 'pdf',
                'file_url' => '/materials/uganda-history.pdf',
                'course_id' => 3,
                'uploaded_by' => 12,
                'file_size' => '4.8 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Uganda\'s Independence Documentary',
                'description' => 'Educational video about Uganda\'s journey to independence and key historical figures',
                'file_type' => 'video',
                'file_url' => '/materials/independence-documentary.mp4',
                'course_id' => 3,
                'uploaded_by' => 12,
                'file_size' => '78.5 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Science Experiments Manual',
                'description' => 'Simple science experiments using locally available materials and resources',
                'file_type' => 'pdf',
                'file_url' => '/materials/science-experiments.pdf',
                'course_id' => 4,
                'uploaded_by' => 12,
                'file_size' => '3.7 MB',
                'downloads' => 0,
            ],

            // Materials for Makerere College School courses
            [
                'title' => 'Biology Diagrams and Charts',
                'description' => 'Detailed biological diagrams with labels in English and local language explanations',
                'file_type' => 'pdf',
                'file_url' => '/materials/biology-diagrams.pdf',
                'course_id' => 5,
                'uploaded_by' => 11,
                'file_size' => '5.2 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Biology Practical Videos',
                'description' => 'Laboratory practical demonstrations for UCE biology syllabus',
                'file_type' => 'video',
                'file_url' => '/materials/biology-practicals.mp4',
                'course_id' => 5,
                'uploaded_by' => 11,
                'file_size' => '92.3 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Chemistry Equations Workbook',
                'description' => 'Chemical equations and reactions workbook with step-by-step solutions',
                'file_type' => 'pdf',
                'file_url' => '/materials/chemistry-equations.pdf',
                'course_id' => 6,
                'uploaded_by' => 10,
                'file_size' => '3.9 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Mathematics Formula Sheet',
                'description' => 'Essential mathematical formulas and identities for secondary school mathematics',
                'file_type' => 'pdf',
                'file_url' => '/materials/math-formulas.pdf',
                'course_id' => 7,
                'uploaded_by' => 11,
                'file_size' => '1.5 MB',
                'downloads' => 0,
            ],

            // Materials for Buddo Junior School courses
            [
                'title' => 'Advanced Mathematics Past Papers',
                'description' => 'UACE mathematics past papers with detailed solutions and marking schemes',
                'file_type' => 'pdf',
                'file_url' => '/materials/uace-math-papers.pdf',
                'course_id' => 8,
                'uploaded_by' => 13,
                'file_size' => '6.8 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'African Literature Collection',
                'description' => 'Collection of African poetry, novels, and plays for literature studies',
                'file_type' => 'pdf',
                'file_url' => '/materials/african-literature.pdf',
                'course_id' => 9,
                'uploaded_by' => 13,
                'file_size' => '7.2 MB',
                'downloads' => 0,
            ],

            // Materials for Jinja Primary School courses
            [
                'title' => 'Counting with Ugandan Objects',
                'description' => 'Learning to count using bananas, mangoes, and other familiar Ugandan items',
                'file_type' => 'pdf',
                'file_url' => '/materials/counting-objects.pdf',
                'course_id' => 10,
                'uploaded_by' => 14,
                'file_size' => '2.1 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Luganda Stories and Songs',
                'description' => 'Traditional Luganda stories and songs for language learning and cultural appreciation',
                'file_type' => 'video',
                'file_url' => '/materials/luganda-stories.mp4',
                'course_id' => 11,
                'uploaded_by' => 14,
                'file_size' => '56.7 MB',
                'downloads' => 0,
            ],

            // Materials for Mbale Secondary School courses
            [
                'title' => 'Pre-Algebra Study Guide',
                'description' => 'Comprehensive guide to pre-algebra concepts and problem solving',
                'file_type' => 'pdf',
                'file_url' => '/materials/pre-algebra-guide.pdf',
                'course_id' => 12,
                'uploaded_by' => 15,
                'file_size' => '4.3 MB',
                'downloads' => 0,
            ],
            [
                'title' => 'Earth Science Lab Activities',
                'description' => 'Hands-on activities for exploring Earth\'s systems and processes',
                'file_type' => 'document',
                'file_url' => '/materials/earth-science-labs.docx',
                'course_id' => 13,
                'uploaded_by' => 15,
                'file_size' => '3.6 MB',
                'downloads' => 0,
            ],
        ];

        foreach ($materials as $material) {
            Material::create($material);
        }
    }
}