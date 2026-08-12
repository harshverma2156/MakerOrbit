import { router, usePage } from '@inertiajs/react';

/**
 * Heart-icon toggle for saving a product to the current user's wishlist.
 * Reads/writes via the `wishlistProductIds` prop shared on every page
 * (see HandleInertiaRequests) so it works the same on the product card,
 * the product page, and the wishlist page itself without prop drilling.
 * Renders nothing for guests — the wishlist routes require auth, same
 * as the cart button's "logged in only" convention.
 */
export default function WishlistButton({ productId, className = '' }) {
    const { auth, wishlistProductIds } = usePage().props;

    if (!auth?.user) {
        return null;
    }

    const isSaved = (wishlistProductIds ?? []).includes(productId);

    const toggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isSaved) {
            router.delete(route('wishlist.destroy', productId), {
                preserveScroll: true,
                preserveState: true,
            });
        } else {
            router.post(
                route('wishlist.store'),
                { product_id: productId },
                { preserveScroll: true, preserveState: true },
            );
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`${className} ${
                isSaved
                    ? 'text-rose-500'
                    : 'text-gray-400 hover:text-rose-500'
            }`}
        >
            <svg
                viewBox="0 0 24 24"
                className="h-full w-full"
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c-.3 0-.59-.1-.82-.29C8.44 17.7 3.75 13.6 3.75 9.15 3.75 6.3 5.93 4 8.63 4c1.5 0 2.9.72 3.37 1.9C12.47 4.72 13.87 4 15.37 4c2.7 0 4.88 2.3 4.88 5.15 0 4.45-4.69 8.55-7.43 10.81-.23.19-.52.29-.82.29Z"
                />
            </svg>
        </button>
    );
}
