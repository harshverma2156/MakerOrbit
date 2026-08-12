import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

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

export default function Show({ product }) {
    const { auth } = usePage().props;
    const [quantity, setQuantity] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const inStock = product.stock_quantity > 0;
    const specs = product.specs ?? {};
    const specEntries = Object.entries(specs);

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
                    <div className="aspect-square w-full overflow-hidden rounded-md border border-gray-200 bg-gray-100 shadow-sm">
                        {product.image_path ? (
                            <img
                                src={product.image_path}
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

                        <p className="mt-1 text-sm text-gray-400">
                            SKU: {product.sku}
                        </p>

                        <p className="mt-4 text-3xl font-bold text-gray-900">
                            {currencyFormatter.format(product.price)}
                        </p>

                        <p
                            className={`mt-2 text-sm font-semibold ${
                                inStock ? 'text-green-600' : 'text-red-500'
                            }`}
                        >
                            {inStock
                                ? `In Stock (${product.stock_quantity} available)`
                                : 'Out of Stock'}
                        </p>

                        {product.description && (
                            <p className="mt-4 text-sm leading-relaxed text-gray-600">
                                {product.description}
                            </p>
                        )}

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
            </div>
        </AppLayout>
    );
}
