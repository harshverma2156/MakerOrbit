<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(): Product
    {
        $category = Category::create(['name' => 'Motors', 'slug' => 'motors']);

        return Product::create([
            'category_id' => $category->id,
            'name' => 'NEMA17 Stepper Motor',
            'slug' => 'nema17-stepper-motor',
            'sku' => 'MOT-NEMA17',
            'price' => 12.5,
            'is_active' => true,
        ]);
    }

    private function purchase(User $user, Product $product, string $status = 'completed'): Order
    {
        $order = Order::create([
            'user_id' => $user->id,
            'status' => $status,
            'subtotal' => $product->price,
            'total' => $product->price,
            'shipping_address' => '123 Test Street',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit_price' => $product->price,
            'quantity' => 1,
            'line_total' => $product->price,
        ]);

        return $order;
    }

    public function test_a_customer_who_purchased_the_product_can_leave_a_review(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();
        $this->purchase($user, $product);

        $response = $this->actingAs($user)->post(route('reviews.store', $product), [
            'rating' => 5,
            'title' => 'Great motor',
            'body' => 'Worked perfectly for my robot arm.',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('reviews', [
            'product_id' => $product->id,
            'user_id' => $user->id,
            'rating' => 5,
            'title' => 'Great motor',
        ]);
    }

    public function test_a_customer_who_has_not_purchased_the_product_cannot_review_it(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();

        $response = $this->actingAs($user)->post(route('reviews.store', $product), [
            'rating' => 5,
        ]);

        $response->assertForbidden();
        $this->assertDatabaseCount('reviews', 0);
    }

    public function test_a_cancelled_order_does_not_count_as_a_purchase(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();
        $this->purchase($user, $product, 'cancelled');

        $response = $this->actingAs($user)->post(route('reviews.store', $product), [
            'rating' => 4,
        ]);

        $response->assertForbidden();
    }

    public function test_guest_cannot_review_a_product(): void
    {
        $product = $this->makeProduct();

        $response = $this->post(route('reviews.store', $product), ['rating' => 5]);

        $response->assertRedirect(route('login'));
    }

    public function test_rating_must_be_between_one_and_five(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();
        $this->purchase($user, $product);

        $this->actingAs($user)
            ->post(route('reviews.store', $product), ['rating' => 6])
            ->assertSessionHasErrors('rating');
    }

    public function test_resubmitting_a_review_updates_it_instead_of_duplicating(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();
        $this->purchase($user, $product);

        $this->actingAs($user)->post(route('reviews.store', $product), [
            'rating' => 3,
            'title' => 'Okay',
        ]);
        $this->actingAs($user)->post(route('reviews.store', $product), [
            'rating' => 5,
            'title' => 'Actually great',
        ]);

        $this->assertDatabaseCount('reviews', 1);
        $this->assertDatabaseHas('reviews', [
            'product_id' => $product->id,
            'user_id' => $user->id,
            'rating' => 5,
            'title' => 'Actually great',
        ]);
    }

    public function test_a_customer_can_delete_their_own_review(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();
        $this->purchase($user, $product);

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'rating' => 4,
        ]);

        $response = $this->actingAs($user)->delete(route('reviews.destroy', $review));

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_a_customer_cannot_delete_someone_elses_review(): void
    {
        $author = User::factory()->create();
        $intruder = User::factory()->create();
        $product = $this->makeProduct();
        $this->purchase($author, $product);

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => $author->id,
            'rating' => 4,
        ]);

        $response = $this->actingAs($intruder)->delete(route('reviews.destroy', $review));

        $response->assertForbidden();
        $this->assertDatabaseHas('reviews', ['id' => $review->id]);
    }

    public function test_the_product_page_reports_the_average_rating_review_count_and_purchase_eligibility(): void
    {
        $reviewer = User::factory()->create();
        $otherReviewer = User::factory()->create();
        $product = $this->makeProduct();
        $this->purchase($reviewer, $product);
        $this->purchase($otherReviewer, $product);

        Review::create(['product_id' => $product->id, 'user_id' => $reviewer->id, 'rating' => 5]);
        Review::create(['product_id' => $product->id, 'user_id' => $otherReviewer->id, 'rating' => 3]);

        $response = $this->actingAs($reviewer)->get(route('products.show', $product));

        $response->assertInertia(fn ($page) => $page
            ->where('product.reviews_count', 2)
            ->where('product.reviews_avg_rating', fn ($value) => abs($value - 4.0) < 0.01)
            ->where('hasPurchased', true)
            ->where('userReview.rating', 5)
        );
    }

    public function test_the_product_page_says_purchase_is_required_for_a_non_purchaser(): void
    {
        $product = $this->makeProduct();
        $browsing = User::factory()->create();

        $response = $this->actingAs($browsing)->get(route('products.show', $product));

        $response->assertInertia(fn ($page) => $page
            ->where('hasPurchased', false)
            ->where('userReview', null)
        );
    }
}
