import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function Index({ products, categories }) {
    const hasCategories = categories.length > 0;

    const deleteProduct = (product) => {
        if (!window.confirm(`Delete "${product.name}"?`)) {
            return;
        }

        router.delete(route('admin.products.destroy', product.id));
    };

    const discountPercent = (product) => {
        const mrp = parseFloat(product.mrp);
        const price = parseFloat(product.price);

        if (!mrp || !price || mrp <= price) {
            return null;
        }

        return Math.round((1 - price / mrp) * 100);
    };

    return (
        <AppLayout title="Manage Products">
            <Head title="Manage Products" />

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Products
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage the{' '}
                            <Link
                                href={route('admin.categories.index')}
                                className="text-indigo-600 underline hover:text-indigo-500"
                            >
                                categories &amp; sub-categories
                            </Link>{' '}
                            first, then add products to them here.
                        </p>
                    </div>

                    {hasCategories ? (
                        <Link
                            href={route('admin.products.create')}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            + Add Product
                        </Link>
                    ) : (
                        <span
                            title="Add a category first"
                            className="inline-flex cursor-not-allowed items-center rounded-md border border-transparent bg-indigo-300 px-4 py-2 text-sm font-semibold text-white"
                        >
                            + Add Product
                        </span>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="rounded-md border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
                        No products yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"
                            >
                                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                    {product.image_path ? (
                                        <img
                                            src={product.image_path}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <svg
                                                className="h-16 w-16"
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

                                    {discountPercent(product) !== null && (
                                        <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                                            {discountPercent(product)}% OFF
                                        </span>
                                    )}

                                    {!product.is_active && (
                                        <span className="absolute right-2 top-2 rounded-full bg-gray-800/80 px-2 py-0.5 text-xs font-semibold text-white">
                                            Inactive
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col gap-1 p-4">
                                    <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                                        {product.category?.name}
                                        {product.sub_category && (
                                            <span className="text-gray-400">
                                                {' '}
                                                &rsaquo;{' '}
                                                {product.sub_category.name}
                                            </span>
                                        )}
                                    </span>

                                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                                        {product.name}
                                    </h3>

                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-base font-bold text-gray-900">
                                            {currencyFormatter.format(
                                                product.price,
                                            )}
                                        </span>
                                        {parseFloat(product.mrp) >
                                            parseFloat(product.price) && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {currencyFormatter.format(
                                                    product.mrp,
                                                )}
                                            </span>
                                        )}
                                    </div>

                                    <span className="text-xs text-gray-500">
                                        Stock: {product.stock_quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteProduct(product)
                                        }
                                        className="mt-2 self-start text-xs font-medium text-red-600 hover:text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
