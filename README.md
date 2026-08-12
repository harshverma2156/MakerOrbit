# MakerOrbit

MakerOrbit is a demo e-commerce storefront for robot parts — motors, sensors,
microcontrollers, chassis kits, and other components for hobby and
competition robot builders. It's a full-stack reference app showing a
Laravel + Inertia + React storefront with a product catalog, cart, checkout,
and order history.

## Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** Inertia.js + React
- **Styling:** Tailwind CSS
- **Build tool:** Vite
- **Database:** MySQL
- **Auth:** Laravel Breeze (React/Inertia stack)

## Setup

1. Install PHP dependencies:

   ```
   composer install
   ```

2. Install JS dependencies:

   ```
   npm install
   ```

3. Copy the environment file and generate an app key:

   ```
   cp .env.example .env
   php artisan key:generate
   ```

4. Set your MySQL credentials in `.env`:

   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=makerorbit
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

   Create the `makerorbit` database in MySQL first if it doesn't already exist.

5. Run migrations and seed demo data (categories, products, and a demo user):

   ```
   php artisan migrate --seed
   ```

6. Start the app (run both in separate terminals):

   ```
   php artisan serve
   npm run dev
   ```

   Visit the URL `php artisan serve` prints (typically `http://127.0.0.1:8000`).

## Demo login

```
Email:    demo@makerorbit.test
Password: password
```

A second seeded account (`test@example.com`, random password via factory) also
exists but isn't intended for demo walkthroughs.

## Implemented features

- **Product catalog** — browse active products, paginated, with search
  (matches name or SKU) and category filtering (`/products`), plus a detail
  page per product (`/products/{slug}`) showing price, stock, description,
  and specs.
- **Cart** — authenticated users can add products to a cart, update line
  item quantities, and remove items (`/cart`).
- **Checkout** — review cart contents, enter a shipping address, and place
  an order; stock is decremented and the cart is cleared on success
  (`/checkout`).
- **Order history** — view past orders and drill into a single order's line
  items, quantities, and totals (`/orders`).
- **Auth** — registration, login, password reset, email verification, and
  profile management via Laravel Breeze.

## Not yet implemented

- **Payments** — checkout captures a shipping address only; there is no
  Stripe (or other payment gateway) integration, so orders are created
  without collecting real payment.
- **Admin panel** — there is no back-office UI for managing products,
  categories, orders, or users. All catalog data comes from the seeders.
- **Product images / uploads** — products have an `image_path` column, but
  there is no image upload flow or seeded image assets; product cards and
  detail pages fall back to a placeholder icon.
