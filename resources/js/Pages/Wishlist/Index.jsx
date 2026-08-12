import ProductCard from '@/Components/ProductCard';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ products }) {
    return (
        <AppLayout title="My Wishlist">
            <Head title="My Wishlist" />

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <h1 className="mb-8 text-2xl font-bold text-gray-900">
                    My Wishlist
                </h1>

                {products.length === 0 ? (
                    <div className="rounded-md border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">
                            You haven&rsquo;t saved anything yet.
                        </p>
                        <Link
                            href={route('products.index')}
                            className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Browse Parts
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
