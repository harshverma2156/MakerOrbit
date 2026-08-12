<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Motors & Actuators',
                'description' => 'Stepper motors, DC gear motors, servos, and linear actuators for driving mechanisms and joints.',
            ],
            [
                'name' => 'Sensors',
                'description' => 'Distance, motion, vision, and environmental sensors for perception and feedback.',
            ],
            [
                'name' => 'Microcontrollers & SBCs',
                'description' => 'Microcontroller boards and single-board computers for control, logic, and onboard compute.',
            ],
            [
                'name' => 'Power & Batteries',
                'description' => 'LiPo and Li-ion battery packs, chargers, power distribution, and voltage regulation.',
            ],
            [
                'name' => 'Chassis & Structural',
                'description' => 'Aluminum and acrylic chassis kits, frames, brackets, and structural components.',
            ],
            [
                'name' => 'Wheels & Tracks',
                'description' => 'Mecanum, omni, rubber, and tank-tread wheels for ground mobility.',
            ],
            [
                'name' => 'Cables & Connectors',
                'description' => 'Jumper wires, JST/XT connectors, terminal blocks, and wiring accessories.',
            ],
            [
                'name' => 'Tools & Hardware',
                'description' => 'Screwdriver sets, fasteners, standoffs, and general build hardware.',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'description' => $category['description'],
                ]
            );
        }
    }
}
