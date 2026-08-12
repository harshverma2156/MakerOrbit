<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(string $name = 'HC-SR04 Sensor', string $slug = 'hc-sr04-sensor'): Product
    {
        $category = Category::firstOrCreate(
            ['slug' => 'sensors'],
            ['name' => 'Sensors'],
        );

        return Product::create([
            'category_id' => $category->id,
            'name' => $name,
            'slug' => $slug,
            'sku' => strtoupper($slug),
            'price' => 4.5,
            'is_active' => true,
        ]);
    }

    public function test_guest_is_redirected_to_login_from_every_wishlist_route(): void
    {
        $product = $this->makeProduct();

        $this->get(route('wishlist.index'))->assertRedirect(route('login'));
        $this->post(route('wishlist.store'), ['product_id' => $product->id])
            ->assertRedirect(route('login'));
        $this->delete(route('wishlist.destroy', $product))
            ->assertRedirect(route('login'));
    }

    public function test_a_user_can_save_a_product_to_their_wishlist(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();

        $response = $this->actingAs($user)->post(route('wishlist.store'), [
            'product_id' => $product->id,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('wishlist_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_saving_the_same_product_twice_does_not_create_a_duplicate_row(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();

        $this->actingAs($user)->post(route('wishlist.store'), ['product_id' => $product->id]);
        $this->actingAs($user)->post(route('wishlist.store'), ['product_id' => $product->id]);

        $this->assertDatabaseCount('wishlist_items', 1);
    }

    public function test_a_user_can_remove_a_product_from_their_wishlist(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();
        WishlistItem::create(['user_id' => $user->id, 'product_id' => $product->id]);

        $response = $this->actingAs($user)->delete(route('wishlist.destroy', $product));

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('wishlist_items', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_a_users_wishlist_only_shows_their_own_saved_products(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $mine = $this->makeProduct('Mine', 'mine');
        $theirs = $this->makeProduct('Theirs', 'theirs');

        WishlistItem::create(['user_id' => $user->id, 'product_id' => $mine->id]);
        WishlistItem::create(['user_id' => $otherUser->id, 'product_id' => $theirs->id]);

        $response = $this->actingAs($user)->get(route('wishlist.index'));

        $response->assertInertia(fn ($page) => $page
            ->has('products', 1)
            ->where('products.0.id', $mine->id)
        );
    }

    public function test_shared_wishlist_product_ids_prop_reflects_the_users_wishlist(): void
    {
        $user = User::factory()->create();
        $product = $this->makeProduct();
        WishlistItem::create(['user_id' => $user->id, 'product_id' => $product->id]);

        $this->actingAs($user)
            ->get(route('products.index'))
            ->assertInertia(fn ($page) => $page->where('wishlistProductIds', [$product->id]));
    }

    public function test_shared_wishlist_product_ids_prop_is_empty_for_guests(): void
    {
        // A separate test (rather than reusing the one above after logging
        // out) so there's no risk of a stale authenticated session leaking
        // across requests within the same test.
        $this->get(route('products.index'))
            ->assertInertia(fn ($page) => $page->where('wishlistProductIds', []));
    }
}
