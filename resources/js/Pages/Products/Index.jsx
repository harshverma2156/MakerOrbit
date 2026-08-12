import ProductCard from '@/Components/ProductCard';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function Index({ products, categories, filters }) {
    const categoryHref = (slug) =>
        route('products.index', {
            category: slug || undefined,
            search: filters?.search || undefined,
        });

    const subCategoryHref = (categorySlug, subCategorySlug) =>
        route('products.index', {
            category: categorySlug,
            subcategory: subCategorySlug || undefined,
            search: filters?.search || undefined,
        });

    return (
        <AppLayout title="Shop Parts">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Shop Parts
                    </h1>

                    {filters?.search && (
                        <p className="text-sm text-gray-500">
                            Showing results for{' '}
                            <span className="font-medium text-gray-700">
                                &ldquo;{filters.search}&rdquo;
                            </span>
                        </p>
                    )}
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

                                        {filters?.category ===
                                            category.slug &&
                                            category.sub_categories?.length >
                                                0 && (
                                                <ul className="ms-3 mt-1 space-y-1 border-s border-gray-100 ps-3">
                                                    {category.sub_categories.map(
                                                        (sub) => (
                                                            <li key={sub.id}>
                                                                <Link
                                                                    href={subCategoryHref(
                                                                        category.slug,
                                                                        sub.slug,
                                                                    )}
                                                                    className={`block rounded-md px-3 py-1.5 text-sm transition ${
                                                                        filters?.subcategory ===
                                                                        sub.slug
                                                                            ? 'font-semibold text-indigo-700'
                                                                            : 'text-gray-500 hover:text-indigo-600'
                                                                    }`}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
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
