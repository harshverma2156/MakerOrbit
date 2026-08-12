<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductCreationTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->withRole('super_admin')->create();
    }

    public function test_product_manager_can_view_the_create_page(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $response = $this->actingAs($this->admin())->get('/admin/products/create');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Products/Create')
            ->has('categories', 1),
        );
    }

    public function test_customer_cannot_view_or_use_the_create_page(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer)->get('/admin/products/create')->assertForbidden();
        $this->actingAs($customer)->post('/admin/products', [])->assertForbidden();
    }

    public function test_it_creates_a_product_with_photos_and_all_detail_fields(): void
    {
        Storage::fake('public');

        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);
        $subCategory = $category->subCategories()->create(['name' => 'IMU', 'slug' => 'imu']);

        $response = $this->actingAs($this->admin())->post('/admin/products', [
            'name' => 'MPU6050 IMU',
            'category_id' => $category->id,
            'sub_category_id' => $subCategory->id,
            'features' => ['I2C interface', '6-axis'],
            'description' => 'A 6-axis gyro/accelerometer breakout.',
            'images' => [
                UploadedFile::fake()->image('front.jpg'),
                UploadedFile::fake()->image('back.jpg'),
            ],
            'specification_url' => 'https://example.com/datasheet.pdf',
            'return_policy' => 'both',
            'return_window_days' => 10,
            'mrp' => 9.99,
            'price' => 7.99,
            'cod_available' => true,
        ]);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHasNoErrors();

        $product = Product::where('name', 'MPU6050 IMU')->first();

        $this->assertNotNull($product);
        $this->assertSame($category->id, $product->category_id);
        $this->assertSame($subCategory->id, $product->sub_category_id);
        $this->assertSame(['I2C interface', '6-axis'], $product->features);
        $this->assertSame('https://example.com/datasheet.pdf', $product->specification_url);
        $this->assertSame('both', $product->return_policy);
        $this->assertSame(10, $product->return_window_days);
        $this->assertTrue($product->cod_available);
        $this->assertEquals(9.99, $product->mrp);
        $this->assertEquals(7.99, $product->price);

        $this->assertCount(2, $product->images);
        $this->assertNotNull($product->image_path);
        Storage::disk('public')->assertExists($product->images->first()->path);
    }

    public function test_it_rejects_more_than_five_photos(): void
    {
        Storage::fake('public');

        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $response = $this->actingAs($this->admin())->post('/admin/products', [
            'name' => 'Too Many Photos',
            'category_id' => $category->id,
            'return_policy' => 'none',
            'price' => 5,
            'images' => array_map(
                fn ($i) => UploadedFile::fake()->image("photo{$i}.jpg"),
                range(1, 6),
            ),
        ]);

        $response->assertSessionHasErrors('images');
        $this->assertNull(Product::where('name', 'Too Many Photos')->first());
    }

    public function test_it_rejects_a_sub_category_that_belongs_to_a_different_category(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);
        $otherCategory = Category::create(['name' => 'Motors', 'slug' => 'motors']);
        $foreignSubCategory = $otherCategory->subCategories()->create(['name' => 'Servos', 'slug' => 'servos']);

        $response = $this->actingAs($this->admin())->post('/admin/products', [
            'name' => 'Mismatched Sub-Category',
            'category_id' => $category->id,
            'sub_category_id' => $foreignSubCategory->id,
            'return_policy' => 'none',
            'price' => 5,
        ]);

        $response->assertStatus(422);
        $this->assertNull(Product::where('name', 'Mismatched Sub-Category')->first());
    }

    public function test_it_requires_a_return_window_when_a_return_policy_is_set(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $response = $this->actingAs($this->admin())->post('/admin/products', [
            'name' => 'Returnable Widget',
            'category_id' => $category->id,
            'return_policy' => 'returnable',
            'price' => 5,
        ]);

        $response->assertSessionHasErrors('return_window_days');
    }

    public function test_it_rejects_an_mrp_lower_than_the_current_price(): void
    {
        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $response = $this->actingAs($this->admin())->post('/admin/products', [
            'name' => 'Backwards Discount',
            'category_id' => $category->id,
            'return_policy' => 'none',
            'price' => 20,
            'mrp' => 10,
        ]);

        $response->assertSessionHasErrors('mrp');
    }

    public function test_deleting_a_product_removes_its_stored_images(): void
    {
        Storage::fake('public');

        $category = Category::create(['name' => 'Sensors', 'slug' => 'sensors']);

        $this->actingAs($this->admin())->post('/admin/products', [
            'name' => 'Deletable Product',
            'category_id' => $category->id,
            'return_policy' => 'none',
            'price' => 5,
            'images' => [UploadedFile::fake()->image('a.jpg')],
        ]);

        $product = Product::where('name', 'Deletable Product')->first();
        $path = $product->images->first()->path;

        Storage::disk('public')->assertExists($path);

        $this->actingAs($this->admin())->delete("/admin/products/{$product->id}");

        Storage::disk('public')->assertMissing($path);
    }
}
