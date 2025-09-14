<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $schools = [
            [
                'name' => 'Kampala Primary School',
                'address' => 'Plot 123, Kampala Road, Central Division, Kampala',
                'status' => 'active',
            ],
            [
                'name' => 'Makerere College School',
                'address' => 'Makerere Hill, Kawempe Division, Kampala',
                'status' => 'active',
            ],
            [
                'name' => 'Buddo Junior School',
                'address' => 'Buddo, Wakiso District, Central Region',
                'status' => 'active',
            ],
            [
                'name' => 'Jinja Primary School',
                'address' => 'Jinja Main Street, Jinja Municipality, Eastern Region',
                'status' => 'active',
            ],
            [
                'name' => 'Mbale Secondary School',
                'address' => 'Republic Street, Mbale Municipality, Eastern Region',
                'status' => 'active',
            ],
            [
                'name' => 'Mbarara High School',
                'address' => 'High Street, Mbarara Municipality, Western Region',
                'status' => 'active',
            ],
            [
                'name' => 'Entebbe Junior School',
                'address' => 'Church Road, Entebbe Municipality, Central Region',
                'status' => 'active',
            ],
            [
                'name' => 'Nakasero Primary School',
                'address' => 'Nakasero Hill, Central Division, Kampala',
                'status' => 'active',
            ],
            [
                'name' => 'Gulu Secondary School',
                'address' => 'Coronation Road, Gulu Municipality, Northern Region',
                'status' => 'active',
            ],
            [
                'name' => 'Masaka College School',
                'address' => 'Circular Road, Masaka Municipality, Central Region',
                'status' => 'active',
            ],
        ];

        foreach ($schools as $school) {
            School::create($school);
        }
    }
}