<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SchoolSeeder::class,
            UserSeeder::class,
            ClassSeeder::class,
            CourseSeeder::class,
            MaterialSeeder::class,
            EnrollmentSeeder::class,
        ]);
    }
}