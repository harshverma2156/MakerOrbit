import { Link } from '@inertiajs/react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function ProductCard({ product }) {
    const identifier = product.slug ?? product.id;
    const inStock = (product.stock_quantity ?? 0) > 0;

    return (
        <div className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            <Link
                href={route('products.show', identifier)}
                className="block aspect-square w-full overflow-hidden bg-gray-100"
            >
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
            </Link>

            <div className="flex flex-1 flex-col gap-2 p-4">
                {product.category?.name && (
                    <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                        {product.category.name}
                    </span>
                )}

                <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                    {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-base font-bold text-gray-900">
                        {currencyFormatter.format(product.price)}
                    </span>

                    {!inStock && (
                        <span className="text-xs font-medium text-red-500">
                            Out of stock
                        </span>
                    )}
                </div>

                <Link
                    href={route('products.show', identifier)}
                    className="mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    View
                </Link>
            </div>
        </div>
    );
}
