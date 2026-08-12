import StarRating from '@/Components/StarRating';
import WishlistButton from '@/Components/WishlistButton';
import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Below this many units left (but still in stock), nudge with an
// urgency badge instead of the plain "in stock" state.
const LOW_STOCK_THRESHOLD = 5;

// How long each photo stays on screen while hovering a multi-photo card.
const HOVER_CYCLE_MS = 1000;

/**
 * Compact browsing tile: photo, name, rating, price. No View/Add to
 * Cart buttons here — the whole card is a single link to the product
 * page (see the overlay below), where quantity + Add to Cart lives.
 */
export default function ProductCard({ product }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const hoverIntervalRef = useRef(null);

    const identifier = product.slug ?? product.id;
    const stockQuantity = product.stock_quantity ?? 0;
    const inStock = stockQuantity > 0;
    const isLowStock = inStock && stockQuantity <= LOW_STOCK_THRESHOLD;

    const gallery =
        product.images && product.images.length > 0
            ? product.images.map((image) => image.url)
            : product.image_path
              ? [product.image_path]
              : [];

    // On hover, step through the rest of the product's photos one at a
    // time; leaving the card stops the cycle and snaps back to the
    // cover photo. A single-photo product has nothing to cycle to.
    const startHoverCycle = () => {
        if (gallery.length <= 1) {
            return;
        }

        hoverIntervalRef.current = setInterval(() => {
            setActiveImageIndex((previous) => (previous + 1) % gallery.length);
        }, HOVER_CYCLE_MS);
    };

    const stopHoverCycle = () => {
        clearInterval(hoverIntervalRef.current);
        hoverIntervalRef.current = null;
        setActiveImageIndex(0);
    };

    // Belt-and-suspenders: clear the interval if the card unmounts
    // mid-hover (e.g. the grid re-renders after a filter change).
    useEffect(() => () => clearInterval(hoverIntervalRef.current), []);

    const mrp = parseFloat(product.mrp);
    const price = parseFloat(product.price);
    const discountPercent =
        mrp && price && mrp > price
            ? Math.round((1 - price / mrp) * 100)
            : null;

    return (
        <div className="relative flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            {/* Makes the whole card clickable: an invisible link stretched
                over the entire card, stacked above the plain visuals but
                below the wishlist heart so that keeps working on its own.
                A sibling rather than a wrapper — nesting a <button> inside
                an <a> is invalid HTML and unreliable across browsers. */}
            <Link
                href={route('products.show', identifier)}
                onMouseEnter={startHoverCycle}
                onMouseLeave={stopHoverCycle}
                aria-label={product.name}
                className="absolute inset-0 z-10 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            />

            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                {discountPercent !== null && (
                    <span className="absolute left-1.5 top-1.5 z-20 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                        {discountPercent}% OFF
                    </span>
                )}

                <WishlistButton
                    productId={product.id}
                    className="absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 p-1.5 shadow-sm transition"
                />

                {gallery.length > 0 ? (
                    <img
                        src={gallery[activeImageIndex]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <svg
                            className="h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5v10.5H3.75V6.75Zm0 0 8.25 6 8.25-6"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 17.25h16.5"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1 p-2.5">
                {product.category?.name && (
                    <span className="text-[11px] font-medium uppercase tracking-wide text-indigo-600">
                        {product.category.name}
                    </span>
                )}

                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                    {product.name}
                </h3>

                <StarRating
                    rating={product.reviews_avg_rating}
                    count={product.reviews_count}
                    size="h-3 w-3"
                    className="text-[11px]"
                />

                <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <span className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900">
                            {currencyFormatter.format(product.price)}
                        </span>
                        {discountPercent !== null && (
                            <span className="text-xs text-gray-400 line-through">
                                {currencyFormatter.format(product.mrp)}
                            </span>
                        )}
                    </span>

                    {!inStock ? (
                        <span className="shrink-0 text-xs font-medium text-red-500">
                            Out of stock
                        </span>
                    ) : (
                        isLowStock && (
                            <span className="shrink-0 rounded-full bg-orange-50 px-1.5 py-0.5 text-[11px] font-semibold text-orange-600">
                                Only {stockQuantity} left!
                            </span>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
