import ProductCard from '@/Components/ProductCard';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ products, categories, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');

    const submitSearch = (e) => {
        e.preventDefault();

        router.get(
            route('products.index'),
            {
                search: search || undefined,
                category: filters?.category || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const categoryHref = (slug) =>
        route('products.index', {
            category: slug || undefined,
            search: filters?.search || undefined,
        });

    return (
        <AppLayout title="Shop Parts">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Shop Parts
                    </h1>

                    <form
                        onSubmit={submitSearch}
                        className="flex w-full max-w-md items-center gap-2"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or SKU..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                            type="submit"
                            className="inline-flex shrink-0 items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Search
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <aside className="lg:col-span-1">
                        <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Categories
                            </h2>

                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        href={categoryHref(null)}
                                        className={`block rounded-md px-3 py-2 text-sm transition ${
                                            !filters?.category
                                                ? 'bg-indigo-50 font-semibold text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        All Categories
                                    </Link>
                                </li>

                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={categoryHref(category.slug)}
                                            className={`block rounded-md px-3 py-2 text-sm transition ${
                                                filters?.category ===
                                                category.slug
                                                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <div className="lg:col-span-3">
                        {products.data.length === 0 ? (
                            <div className="rounded-md border border-gray-200 bg-white p-10 text-center shadow-sm">
                                <p className="text-gray-500">
                                    No parts matched your search. Try a
                                    different keyword or category.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {products.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        )}

                        {products.links && products.links.length > 3 && (
                            <nav className="mt-10 flex flex-wrap items-center justify-center gap-1">
                                {products.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url ?? '#'}
                                        preserveState
                                        preserveScroll
                                        className={`min-w-9 rounded-md px-3 py-2 text-center text-sm ${
                                            link.active
                                                ? 'bg-indigo-600 font-semibold text-white'
                                                : link.url
                                                  ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                  : 'cursor-not-allowed border border-gray-100 bg-white text-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
