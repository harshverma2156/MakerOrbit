<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductSearchTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(array $attributes): Product
    {
        return Product::create(array_merge([
            'price' => 9.99,
            'is_active' => true,
        ], $attributes));
    }

    public function test_search_matches_product_name(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $match = $this->makeProduct([
            'category_id' => $category->id,
            'name' => 'NEMA17 Stepper Motor',
            'slug' => 'nema17-stepper-motor',
            'sku' => 'MOT-NEMA17',
            'description' => 'A bipolar stepper motor.',
        ]);
        $other = $this->makeProduct([
            'category_id' => $category->id,
            'name' => 'Micro Servo',
            'slug' => 'micro-servo',
            'sku' => 'MOT-SERVO',
            'description' => 'A small servo.',
        ]);

        $response = $this->get(route('products.index', ['search' => 'stepper']));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
        );
    }

    public function test_search_matches_product_sku(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $match = $this->makeProduct([
            'category_id' => $category->id,
            'name' => 'Ultrasonic Distance Sensor',
            'slug' => 'ultrasonic-distance-sensor',
            'sku' => 'SEN-HCSR04',
            'description' => 'Ranging module.',
        ]);

        $response = $this->get(route('products.index', ['search' => 'hcsr04']));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
        );
    }

    public function test_search_matches_a_term_that_only_appears_in_the_description(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $match = $this->makeProduct([
            'category_id' => $category->id,
            'name' => 'RPLIDAR A1 360° Laser Scanner',
            'slug' => 'rplidar-a1',
            'sku' => 'SEN-RPLIDARA1',
            'description' => '360-degree 2D laser range scanner for SLAM and autonomous navigation.',
        ]);
        $other = $this->makeProduct([
            'category_id' => $category->id,
            'name' => 'Micro Servo',
            'slug' => 'micro-servo',
            'sku' => 'MOT-SERVO',
            'description' => 'A small servo, nothing to do with mapping.',
        ]);

        $response = $this->get(route('products.index', ['search' => 'SLAM']));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
        );
    }

    public function test_search_matches_the_products_category_name(): void
    {
        $sensors = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);
        $motors = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $match = $this->makeProduct([
            'category_id' => $sensors->id,
            'name' => 'HC-SR04',
            'slug' => 'hc-sr04',
            'sku' => 'SEN-HCSR04',
        ]);
        $other = $this->makeProduct([
            'category_id' => $motors->id,
            'name' => 'SG90 Micro Servo',
            'slug' => 'sg90-micro-servo',
            'sku' => 'MOT-SG90',
        ]);

        $response = $this->get(route('products.index', ['search' => 'Sensors']));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
        );
    }

    public function test_search_matches_the_products_sub_category_name(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);
        $subCategory = SubCategory::create([
            'category_id' => $category->id,
            'name' => 'Distance Sensors',
            'slug' => 'distance-sensors',
        ]);

        $match = $this->makeProduct([
            'category_id' => $category->id,
            'sub_category_id' => $subCategory->id,
            'name' => 'HC-SR04',
            'slug' => 'hc-sr04',
            'sku' => 'SEN-HCSR04',
        ]);
        $other = $this->makeProduct([
            'category_id' => $category->id,
            'name' => 'MPU6050 IMU',
            'slug' => 'mpu6050-imu',
            'sku' => 'SEN-MPU6050',
        ]);

        $response = $this->get(route('products.index', ['search' => 'Distance Sensors']));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $match->id)
        );
    }

    public function test_search_excludes_inactive_products(): void
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $this->makeProduct([
            'category_id' => $category->id,
            'name' => 'NEMA17 Stepper Motor',
            'slug' => 'nema17-stepper-motor',
            'sku' => 'MOT-NEMA17',
            'is_active' => false,
        ]);

        $response = $this->get(route('products.index', ['search' => 'stepper']));

        $response->assertInertia(fn ($page) => $page->has('products.data', 0));
    }

    public function test_search_with_no_matches_returns_an_empty_list(): void
    {
        Category::create(['name' => 'Motors', 'slug' => 'motors']);

        $response = $this->get(route('products.index', ['search' => 'nonexistent-widget']));

        $response->assertInertia(fn ($page) => $page->has('products.data', 0));
    }
}
