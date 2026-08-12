<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Products are grouped by category name. If the category does not
     * already exist (e.g. this seeder is run without CategorySeeder),
     * it is created on the fly so this seeder can stand alone.
     */
    public function run(): void
    {
        $catalog = [
            'Motors & Actuators' => [
                [
                    'name' => 'NEMA17 Stepper Motor 1.8° 42mm',
                    'sku' => 'MOT-NEMA17-42',
                    'description' => 'Standard NEMA17 bipolar stepper motor with 1.8° step angle, ideal for 3D printers, CNC, and robot joints.',
                    'price' => 14.99,
                    'stock_quantity' => 120,
                    'specs' => [
                        'voltage' => '12V',
                        'torque_kgcm' => 4.5,
                        'weight_kg' => 0.28,
                        'dimensions_mm' => '42x42x40',
                        'compatibility' => ['A4988', 'DRV8825', 'TB6600'],
                    ],
                ],
                [
                    'name' => 'SG90 Micro Servo 9g',
                    'sku' => 'MOT-SG90-9G',
                    'description' => 'Lightweight analog micro servo for pan/tilt mounts, grippers, and small linkages.',
                    'price' => 3.49,
                    'stock_quantity' => 300,
                    'specs' => [
                        'voltage' => '4.8-6V',
                        'torque_kgcm' => 1.8,
                        'weight_kg' => 0.009,
                        'dimensions_mm' => '22.2x11.8x31',
                        'compatibility' => ['Arduino', 'Raspberry Pi', 'ESP32'],
                    ],
                ],
                [
                    'name' => 'MG996R High-Torque Servo',
                    'sku' => 'MOT-MG996R',
                    'description' => 'Metal-gear high-torque servo for robot arms and load-bearing joints.',
                    'price' => 7.99,
                    'stock_quantity' => 150,
                    'specs' => [
                        'voltage' => '4.8-7.2V',
                        'torque_kgcm' => 11,
                        'weight_kg' => 0.055,
                        'dimensions_mm' => '40.7x19.7x42.9',
                        'compatibility' => ['Arduino', 'ESP32'],
                    ],
                ],
            ],
            'Sensors' => [
                [
                    'name' => 'HC-SR04 Ultrasonic Distance Sensor',
                    'sku' => 'SEN-HCSR04',
                    'description' => 'Classic ultrasonic ranging module for obstacle detection and distance measurement.',
                    'price' => 2.49,
                    'stock_quantity' => 400,
                    'specs' => [
                        'voltage' => '5V',
                        'range_cm' => '2-400',
                        'weight_kg' => 0.009,
                        'dimensions_mm' => '45x20x15',
                        'compatibility' => ['Arduino', 'Raspberry Pi'],
                    ],
                ],
                [
                    'name' => 'MPU6050 6-Axis Gyro/Accelerometer IMU',
                    'sku' => 'SEN-MPU6050',
                    'description' => 'Combined 3-axis gyroscope and 3-axis accelerometer breakout for balance and orientation sensing.',
                    'price' => 4.99,
                    'stock_quantity' => 250,
                    'specs' => [
                        'voltage' => '3-5V',
                        'interface' => 'I2C',
                        'weight_kg' => 0.005,
                        'dimensions_mm' => '20x15x2',
                        'compatibility' => ['Arduino', 'ESP32', 'Raspberry Pi'],
                    ],
                ],
                [
                    'name' => 'RPLIDAR A1 360° Laser Scanner',
                    'sku' => 'SEN-RPLIDARA1',
                    'description' => '360-degree 2D laser range scanner for SLAM and autonomous navigation.',
                    'price' => 99.00,
                    'stock_quantity' => 20,
                    'specs' => [
                        'voltage' => '5V',
                        'range_m' => 12,
                        'weight_kg' => 0.19,
                        'dimensions_mm' => '76x71x40',
                        'compatibility' => ['Raspberry Pi', 'ROS'],
                    ],
                ],
            ],
            'Microcontrollers & SBCs' => [
                [
                    'name' => 'Raspberry Pi 4 Model B (4GB)',
                    'sku' => 'MCU-RPI4-4GB',
                    'description' => 'Quad-core single-board computer for vision processing, ROS nodes, and onboard compute.',
                    'price' => 55.00,
                    'stock_quantity' => 60,
                    'specs' => [
                        'ram_gb' => 4,
                        'cpu' => 'Broadcom BCM2711 quad-core 1.5GHz',
                        'weight_kg' => 0.046,
                        'dimensions_mm' => '85x56x17',
                        'compatibility' => ['Raspberry Pi OS', 'Ubuntu'],
                    ],
                ],
                [
                    'name' => 'Arduino Uno R3',
                    'sku' => 'MCU-UNOR3',
                    'description' => 'The classic beginner-friendly microcontroller board for motor control and sensor I/O.',
                    'price' => 23.00,
                    'stock_quantity' => 200,
                    'specs' => [
                        'voltage' => '5V',
                        'flash_kb' => 32,
                        'weight_kg' => 0.025,
                        'dimensions_mm' => '68.6x53.4x15',
                        'compatibility' => ['Arduino IDE'],
                    ],
                ],
                [
                    'name' => 'ESP32 DevKit V1 WiFi + BLE Board',
                    'sku' => 'MCU-ESP32-DEVKITV1',
                    'description' => 'Dual-core WiFi/Bluetooth microcontroller board, popular for wireless-controlled robots.',
                    'price' => 8.50,
                    'stock_quantity' => 350,
                    'specs' => [
                        'voltage' => '3.3V',
                        'flash_mb' => 4,
                        'weight_kg' => 0.010,
                        'dimensions_mm' => '55x28x13',
                        'compatibility' => ['Arduino IDE', 'MicroPython'],
                    ],
                ],
            ],
            'Power & Batteries' => [
                [
                    'name' => '3S LiPo Battery 11.1V 5200mAh',
                    'sku' => 'PWR-LIPO-3S5200',
                    'description' => 'High-discharge 3-cell LiPo pack for motor-driven robots and drones.',
                    'price' => 34.99,
                    'stock_quantity' => 80,
                    'specs' => [
                        'voltage' => '11.1V',
                        'capacity_mah' => 5200,
                        'weight_kg' => 0.41,
                        'dimensions_mm' => '138x43x25',
                        'compatibility' => ['XT60 connector'],
                    ],
                ],
                [
                    'name' => '18650 Li-ion Battery 3.7V 3400mAh (Pair)',
                    'sku' => 'PWR-18650-3400X2',
                    'description' => 'Rechargeable 18650 cells for battery packs and portable power banks.',
                    'price' => 12.99,
                    'stock_quantity' => 180,
                    'specs' => [
                        'voltage' => '3.7V',
                        'capacity_mah' => 3400,
                        'weight_kg' => 0.047,
                        'dimensions_mm' => '65x18x18',
                        'compatibility' => ['18650 battery holder'],
                    ],
                ],
                [
                    'name' => '5V 5A Buck Converter Power Module',
                    'sku' => 'PWR-BUCK-5V5A',
                    'description' => 'Step-down voltage regulator module for supplying stable 5V logic power from a higher-voltage battery.',
                    'price' => 6.99,
                    'stock_quantity' => 220,
                    'specs' => [
                        'input_voltage' => '6-35V',
                        'output_voltage' => '5V',
                        'max_current_a' => 5,
                        'weight_kg' => 0.02,
                        'dimensions_mm' => '45x22x12',
                    ],
                ],
            ],
            'Chassis & Structural' => [
                [
                    'name' => '2WD Aluminum Robot Chassis Kit',
                    'sku' => 'CHS-2WD-ALU',
                    'description' => 'Compact two-wheel-drive aluminum chassis kit for beginner ground robots.',
                    'price' => 24.99,
                    'stock_quantity' => 90,
                    'specs' => [
                        'weight_kg' => 0.35,
                        'dimensions_mm' => '215x150x60',
                        'material' => 'Aluminum',
                        'compatibility' => ['TT motors', 'NEMA17 with bracket'],
                    ],
                ],
                [
                    'name' => '4WD Mecanum Robot Chassis Kit',
                    'sku' => 'CHS-4WD-MEC',
                    'description' => 'Four-wheel-drive aluminum chassis built for omnidirectional mecanum platforms.',
                    'price' => 64.99,
                    'stock_quantity' => 45,
                    'specs' => [
                        'weight_kg' => 1.2,
                        'dimensions_mm' => '280x230x80',
                        'material' => 'Aluminum',
                        'compatibility' => ['Mecanum wheels', 'DC gear motors'],
                    ],
                ],
                [
                    'name' => 'Acrylic Sensor Mounting Plate Set',
                    'sku' => 'CHS-ACR-MOUNTSET',
                    'description' => 'Laser-cut acrylic plates for mounting sensors, brackets, and electronics boards.',
                    'price' => 9.99,
                    'stock_quantity' => 130,
                    'specs' => [
                        'weight_kg' => 0.08,
                        'dimensions_mm' => '100x100x3',
                        'material' => 'Acrylic 3mm',
                    ],
                ],
            ],
            'Wheels & Tracks' => [
                [
                    'name' => 'Mecanum Wheel 60mm (Set of 4)',
                    'sku' => 'WHL-MEC-60MM',
                    'description' => 'Omnidirectional mecanum wheel set enabling strafing and holonomic movement.',
                    'price' => 29.99,
                    'stock_quantity' => 70,
                    'specs' => [
                        'diameter_mm' => 60,
                        'weight_kg' => 0.28,
                        'load_capacity_kg' => 5,
                        'compatibility' => ['6mm D-shaft motors'],
                    ],
                ],
                [
                    'name' => 'Omni Wheel 58mm',
                    'sku' => 'WHL-OMNI-58MM',
                    'description' => 'Single omni-directional wheel with free rollers for smooth multi-axis rolling.',
                    'price' => 8.99,
                    'stock_quantity' => 140,
                    'specs' => [
                        'diameter_mm' => 58,
                        'weight_kg' => 0.06,
                        'load_capacity_kg' => 2,
                        'compatibility' => ['N20 motors', 'TT motors'],
                    ],
                ],
                [
                    'name' => 'Rubber Tank Tread Set',
                    'sku' => 'WHL-TRACK-RUBBER',
                    'description' => 'Flexible rubber track set for tank-style chassis and rough-terrain robots.',
                    'price' => 19.99,
                    'stock_quantity' => 60,
                    'specs' => [
                        'length_mm' => 300,
                        'weight_kg' => 0.32,
                        'load_capacity_kg' => 8,
                        'compatibility' => ['Tank chassis kits'],
                    ],
                ],
            ],
            'Cables & Connectors' => [
                [
                    'name' => 'Jumper Wire Kit (M-M, M-F, F-F, 120pc)',
                    'sku' => 'CBL-JUMPER-120',
                    'description' => 'Assorted breadboard jumper wires in male-male, male-female, and female-female configurations.',
                    'price' => 5.99,
                    'stock_quantity' => 500,
                    'specs' => [
                        'length_mm' => 200,
                        'quantity' => 120,
                        'wire_gauge_awg' => 26,
                    ],
                ],
                [
                    'name' => 'XT60 Connector Pair (10 Sets)',
                    'sku' => 'CBL-XT60-10SET',
                    'description' => 'High-current bullet connectors commonly used for LiPo battery packs.',
                    'price' => 7.99,
                    'stock_quantity' => 300,
                    'specs' => [
                        'rated_current_a' => 30,
                        'quantity' => 10,
                        'compatibility' => ['LiPo battery packs'],
                    ],
                ],
                [
                    'name' => 'JST-PH 2.0mm Connector Kit',
                    'sku' => 'CBL-JSTPH-KIT',
                    'description' => 'JST-PH connector housings, pins, and crimps for compact wiring harnesses.',
                    'price' => 6.49,
                    'stock_quantity' => 260,
                    'specs' => [
                        'pin_count' => '2-6',
                        'quantity' => 40,
                        'wire_gauge_awg' => 28,
                    ],
                ],
            ],
            'Tools & Hardware' => [
                [
                    'name' => 'Precision Screwdriver Set (32-in-1)',
                    'sku' => 'TL-SCREWDRIVER-32',
                    'description' => 'Magnetic precision screwdriver set covering Phillips, flathead, Torx, and hex bits for electronics builds.',
                    'price' => 12.99,
                    'stock_quantity' => 160,
                    'specs' => [
                        'piece_count' => 32,
                        'weight_kg' => 0.4,
                        'case_material' => 'Aluminum',
                    ],
                ],
                [
                    'name' => 'M3 Standoff & Screw Assortment Kit',
                    'sku' => 'TL-M3-STANDOFF-KIT',
                    'description' => 'Brass standoffs, screws, and nuts in M3 thread for mounting boards and chassis panels.',
                    'price' => 9.99,
                    'stock_quantity' => 240,
                    'specs' => [
                        'thread_size' => 'M3',
                        'piece_count' => 120,
                        'weight_kg' => 0.25,
                    ],
                ],
                [
                    'name' => 'Digital Calipers 150mm',
                    'sku' => 'TL-CALIPER-150',
                    'description' => 'Stainless steel digital calipers for precise part measurement during builds.',
                    'price' => 14.99,
                    'stock_quantity' => 100,
                    'specs' => [
                        'range_mm' => 150,
                        'resolution_mm' => 0.01,
                        'weight_kg' => 0.12,
                        'material' => 'Stainless steel',
                    ],
                ],
            ],
        ];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::firstOrCreate(
                ['slug' => Str::slug($categoryName)],
                ['name' => $categoryName]
            );

            foreach ($products as $product) {
                Product::updateOrCreate(
                    ['sku' => $product['sku']],
                    [
                        'category_id' => $category->id,
                        'name' => $product['name'],
                        'slug' => Str::slug($product['name']),
                        'description' => $product['description'],
                        'price' => $product['price'],
                        'stock_quantity' => $product['stock_quantity'],
                        'image_path' => null,
                        'specs' => $product['specs'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
