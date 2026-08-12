import ProductCard from '@/Components/ProductCard';
import StarRating from '@/Components/StarRating';
import WishlistButton from '@/Components/WishlistButton';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Below this many units left (but still in stock), nudge with an
// urgency badge instead of the plain "in stock" state — same threshold
// as ProductCard, kept in sync by convention rather than a shared import
// since it's a single number used in two small, unrelated components.
const LOW_STOCK_THRESHOLD = 5;

function formatSpecLabel(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSpecValue(value) {
    if (Array.isArray(value)) {
        return value.join(', ');
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return String(value);
}

const returnPolicyLabels = {
    none: 'No returns or replacements',
    returnable: 'Returnable',
    replaceable: 'Replaceable only',
    both: 'Returnable & replaceable',
};

function formatReviewDate(value) {
    return value
        ? new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '';
}

/**
 * Star-picker + title/body fields for submitting or updating a review.
 * Only rendered when the shopper is eligible (see the gating in Show
 * below) — the server enforces the same "must have purchased" rule
 * regardless, this just avoids showing a form that would 403.
 */
function ReviewForm({ product, existingReview }) {
    const [rating, setRating] = useState(existingReview?.rating ?? 5);
    const [title, setTitle] = useState(existingReview?.title ?? '');
    const [body, setBody] = useState(existingReview?.body ?? '');
    const [submitting, setSubmitting] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        router.post(
            route('reviews.store', product.slug),
            { rating, title, body },
            { preserveScroll: true, onFinish: () => setSubmitting(false) },
        );
    };

    return (
        <form
            onSubmit={submit}
            className="rounded-md border border-gray-200 bg-gray-50 p-4"
        >
            <h3 className="text-sm font-semibold text-gray-900">
                {existingReview ? 'Update your review' : 'Write a review'}
            </h3>

            <div className="mt-3">
                <label className="block text-xs font-medium text-gray-500">
                    Your rating
                </label>
                <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            title={`${value} star${value > 1 ? 's' : ''}`}
                            className="p-0.5"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className={`h-6 w-6 ${
                                    value <= rating
                                        ? 'text-amber-400'
                                        : 'text-gray-300'
                                }`}
                                fill="currentColor"
                            >
                                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0l-4.725 2.885a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-3">
                <label
                    htmlFor="review-title"
                    className="block text-xs font-medium text-gray-500"
                >
                    Title (optional)
                </label>
                <input
                    id="review-title"
                    type="text"
                    value={title}
                    maxLength={120}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <div className="mt-3">
                <label
                    htmlFor="review-body"
                    className="block text-xs font-medium text-gray-500"
                >
                    Review (optional)
                </label>
                <textarea
                    id="review-body"
                    rows={3}
                    value={body}
                    maxLength={2000}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {existingReview ? 'Update Review' : 'Submit Review'}
            </button>
        </form>
    );
}

export default function Show({
    product,
    hasPurchased,
    userReview,
    relatedProducts,
}) {
    const { auth } = usePage().props;
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const stockQuantity = product.stock_quantity ?? 0;
    const inStock = stockQuantity > 0;
    const isLowStock = inStock && stockQuantity <= LOW_STOCK_THRESHOLD;
    const specs = product.specs ?? {};
    const specEntries = Object.entries(specs);
    const features = product.features ?? [];
    const reviews = product.reviews ?? [];

    const mrp = parseFloat(product.mrp);
    const price = parseFloat(product.price);
    const discountPercent =
        mrp && price && mrp > price
            ? Math.round((1 - price / mrp) * 100)
            : null;

    const gallery =
        product.images && product.images.length > 0
            ? product.images.map((image) => image.url)
            : product.image_path
              ? [product.image_path]
              : [];

    const handleAddToCart = (e) => {
        e.preventDefault();

        if (!inStock || submitting) {
            return;
        }

        setSubmitting(true);

        router.post(
            route('cart.store'),
            {
                product_id: product.id,
                quantity,
            },
            {
                onFinish: () => setSubmitting(false),
            },
        );
    };

    const handleDeleteReview = (review) => {
        if (!window.confirm('Remove your review?')) {
            return;
        }

        router.delete(route('reviews.destroy', review.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title={product.name}>
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('products.index')}
                    className="mb-6 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                >
                    &larr; Back to all parts
                </Link>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <div>
                        <div className="relative aspect-square w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100 shadow-sm">
                            {discountPercent !== null && (
                                <span className="absolute left-3 top-3 z-10 rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white">
                                    {discountPercent}% OFF
                                </span>
                            )}

                            <WishlistButton
                                productId={product.id}
                                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 p-2 shadow-sm transition"
                            />

                            {gallery.length > 0 ? (
                                <img
                                    src={gallery[activeImage]}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-300">
                                    <svg
                                        className="h-24 w-24"
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

                        {gallery.length > 1 && (
                            <div className="mt-3 flex gap-2">
                                {gallery.map((src, index) => (
                                    <button
                                        key={src}
                                        type="button"
                                        onClick={() => setActiveImage(index)}
                                        className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                                            index === activeImage
                                                ? 'border-indigo-500'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={src}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        {product.category?.name && (
                            <Link
                                href={route(
                                    'products.index',
                                    product.category.slug
                                        ? { category: product.category.slug }
                                        : {},
                                )}
                                className="text-sm font-medium uppercase tracking-wide text-indigo-600 hover:text-indigo-500"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            {product.name}
                        </h1>

                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById('reviews')
                                    ?.scrollIntoView({ behavior: 'smooth' })
                            }
                            className="mt-1"
                        >
                            <StarRating
                                rating={product.reviews_avg_rating}
                                count={product.reviews_count}
                            />
                        </button>

                        <p className="mt-1 text-sm text-gray-400">
                            SKU: {product.sku}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <p className="text-3xl font-bold text-gray-900">
                                {currencyFormatter.format(product.price)}
                            </p>
                            {discountPercent !== null && (
                                <>
                                    <p className="text-lg text-gray-400 line-through">
                                        {currencyFormatter.format(
                                            product.mrp,
                                        )}
                                    </p>
                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-sm font-semibold text-green-700">
                                        {discountPercent}% off
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <p
                                className={`text-sm font-semibold ${
                                    inStock
                                        ? 'text-green-600'
                                        : 'text-red-500'
                                }`}
                            >
                                {inStock
                                    ? `In Stock (${stockQuantity} available)`
                                    : 'Out of Stock'}
                            </p>

                            {isLowStock && (
                                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                                    Only {stockQuantity} left!
                                </span>
                            )}
                        </div>

                        {features.length > 0 && (
                            <ul className="mt-4 space-y-1">
                                {features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-2 text-sm text-gray-700"
                                    >
                                        <svg
                                            className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {product.description && (
                            <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                {product.description}
                            </p>
                        )}

                        {product.specification_url && (
                            <a
                                href={product.specification_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Full specifications &amp; datasheet
                                <svg
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                    />
                                </svg>
                            </a>
                        )}

                        <dl className="mt-4 grid grid-cols-1 gap-2 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm sm:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <dt className="font-medium text-gray-600">
                                    Cash on Delivery:
                                </dt>
                                <dd
                                    className={
                                        product.cod_available
                                            ? 'text-green-700'
                                            : 'text-gray-500'
                                    }
                                >
                                    {product.cod_available
                                        ? 'Available'
                                        : 'Not available'}
                                </dd>
                            </div>
                            <div className="flex items-center gap-2">
                                <dt className="font-medium text-gray-600">
                                    Returns:
                                </dt>
                                <dd className="text-gray-700">
                                    {returnPolicyLabels[
                                        product.return_policy
                                    ] ?? returnPolicyLabels.none}
                                    {product.return_policy !== 'none' &&
                                        product.return_window_days &&
                                        ` (${product.return_window_days} days)`}
                                </dd>
                            </div>
                        </dl>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            {auth?.user ? (
                                <form
                                    onSubmit={handleAddToCart}
                                    className="flex items-center gap-3"
                                >
                                    <label
                                        htmlFor="quantity"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Qty
                                    </label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max={product.stock_quantity || 1}
                                        value={quantity}
                                        disabled={!inStock}
                                        onChange={(e) =>
                                            setQuantity(
                                                Math.max(
                                                    1,
                                                    parseInt(
                                                        e.target.value,
                                                        10,
                                                    ) || 1,
                                                ),
                                            )
                                        }
                                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />

                                    <button
                                        type="submit"
                                        disabled={!inStock || submitting}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
                                    >
                                        {inStock
                                            ? 'Add to Cart'
                                            : 'Out of Stock'}
                                    </button>
                                </form>
                            ) : (
                                <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4">
                                    <p className="text-sm text-indigo-700">
                                        <Link
                                            href={route('login')}
                                            className="font-semibold underline hover:text-indigo-600"
                                        >
                                            Log in
                                        </Link>{' '}
                                        to purchase this item.
                                    </p>
                                </div>
                            )}
                        </div>

                        {specEntries.length > 0 && (
                            <div className="mt-8">
                                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Specifications
                                </h2>

                                <div className="overflow-hidden rounded-md border border-gray-200 shadow-sm">
                                    <table className="w-full divide-y divide-gray-200 text-sm">
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {specEntries.map(
                                                ([key, value]) => (
                                                    <tr key={key}>
                                                        <th
                                                            scope="row"
                                                            className="w-1/3 bg-gray-50 px-4 py-2 text-left font-medium text-gray-600"
                                                        >
                                                            {formatSpecLabel(
                                                                key,
                                                            )}
                                                        </th>
                                                        <td className="px-4 py-2 text-gray-800">
                                                            {formatSpecValue(
                                                                value,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div id="reviews" className="mt-14 border-t border-gray-200 pt-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Customer Reviews
                        </h2>
                        <StarRating
                            rating={product.reviews_avg_rating}
                            count={product.reviews_count}
                            size="h-5 w-5"
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {reviews.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No reviews yet — be the first to share
                                    what you think.
                                </p>
                            ) : (
                                reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <StarRating
                                                rating={review.rating}
                                                showCount={false}
                                                size="h-4 w-4"
                                            />
                                            {auth?.user?.id ===
                                                review.user_id && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteReview(
                                                            review,
                                                        )
                                                    }
                                                    className="text-xs font-medium text-red-600 hover:text-red-500"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        {review.title && (
                                            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                                {review.title}
                                            </h3>
                                        )}

                                        {review.body && (
                                            <p className="mt-1 text-sm leading-relaxed text-gray-600">
                                                {review.body}
                                            </p>
                                        )}

                                        <p className="mt-2 text-xs text-gray-400">
                                            <span className="font-medium text-gray-600">
                                                {review.user?.name ??
                                                    'Anonymous'}
                                            </span>{' '}
                                            &middot; Verified Purchase
                                            &middot;{' '}
                                            {formatReviewDate(
                                                review.created_at,
                                            )}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div>
                            {!auth?.user ? (
                                <div className="rounded-md border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
                                    <Link
                                        href={route('login')}
                                        className="font-semibold underline hover:text-indigo-600"
                                    >
                                        Log in
                                    </Link>{' '}
                                    to write a review.
                                </div>
                            ) : hasPurchased ? (
                                <ReviewForm
                                    product={product}
                                    existingReview={userReview}
                                />
                            ) : (
                                <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                                    Only customers who&rsquo;ve purchased
                                    this product can leave a review.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {relatedProducts?.length > 0 && (
                    <div className="mt-14 border-t border-gray-200 pt-10">
                        <h2 className="mb-6 text-xl font-bold text-gray-900">
                            You may also like
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((related) => (
                                <ProductCard
                                    key={related.id}
                                    product={related}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
