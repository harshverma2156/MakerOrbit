import ProductCard from '@/Components/ProductCard';
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const SORT_OPTIONS = [
    { value: '', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Index({ products, categories, filters }) {
    // Sort/in-stock apply immediately on change; price range only
    // applies on submit so it doesn't fire a request per keystroke.
    const [minPrice, setMinPrice] = useState(filters?.min_price ?? '');
    const [maxPrice, setMaxPrice] = useState(filters?.max_price ?? '');

    const buildParams = (overrides = {}) => ({
        search: filters?.search || undefined,
        category: filters?.category || undefined,
        subcategory: filters?.subcategory || undefined,
        sort: filters?.sort || undefined,
        min_price: filters?.min_price || undefined,
        max_price: filters?.max_price || undefined,
        in_stock: filters?.in_stock || undefined,
        ...overrides,
    });

    const applyFilters = (overrides) => {
        router.get(route('products.index', buildParams(overrides)), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const categoryHref = (slug) =>
        route('products.index', buildParams({ category: slug || undefined, subcategory: undefined }));

    const subCategoryHref = (categorySlug, subCategorySlug) =>
        route(
            'products.index',
            buildParams({
                category: categorySlug,
                subcategory: subCategorySlug || undefined,
            }),
        );

    const handlePriceSubmit = (e) => {
        e.preventDefault();
        applyFilters({
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
        });
    };

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
                    <aside className="lg:col-span-1 space-y-4">
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

                        <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
                            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Filters
                            </h2>

                            <form
                                onSubmit={handlePriceSubmit}
                                className="space-y-3"
                            >
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">
                                        Price range
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            inputMode="decimal"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) =>
                                                setMinPrice(e.target.value)
                                            }
                                            className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="text-gray-400">
                                            &ndash;
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            inputMode="decimal"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) =>
                                                setMaxPrice(e.target.value)
                                            }
                                            className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-md border border-transparent bg-indigo-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 transition hover:bg-indigo-100"
                                >
                                    Apply
                                </button>

                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(filters?.in_stock)}
                                        onChange={(e) =>
                                            applyFilters({
                                                in_stock: e.target.checked
                                                    ? 1
                                                    : undefined,
                                            })
                                        }
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    In stock only
                                </label>
                            </form>
                        </div>
                    </aside>

                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <p className="text-sm text-gray-500">
                                {products.total ?? products.data.length}{' '}
                                {(products.total ?? products.data.length) ===
                                1
                                    ? 'part'
                                    : 'parts'}{' '}
                                found
                            </p>

                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                Sort by
                                <select
                                    value={filters?.sort ?? ''}
                                    onChange={(e) =>
                                        applyFilters({
                                            sort: e.target.value || undefined,
                                        })
                                    }
                                    className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {products.data.length === 0 ? (
                            <div className="rounded-md border border-gray-200 bg-white p-10 text-center shadow-sm">
                                <p className="text-gray-500">
                                    No parts matched your search. Try a
                                    different keyword, category, or filter.
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
