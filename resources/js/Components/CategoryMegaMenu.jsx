import { Link } from '@inertiajs/react';

/**
 * Desktop category bar: hovering a category reveals its sub-categories.
 * Clicking a category goes to all products in it; clicking a sub-category
 * goes to products filtered to just that sub-category.
 */
export default function CategoryMegaMenu({ categories }) {
    if (!categories?.length) {
        return null;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 py-2 text-sm">
                <li className="shrink-0">
                    <Link
                        href={route('products.index')}
                        className="block py-1 font-medium text-gray-600 transition hover:text-indigo-600"
                    >
                        All Products
                    </Link>
                </li>

                {categories.map((category) => (
                    <li key={category.id} className="group relative shrink-0">
                        <Link
                            href={route('products.index', {
                                category: category.slug,
                            })}
                            className="flex items-center gap-1 py-1 font-medium text-gray-600 transition hover:text-indigo-600"
                        >
                            {category.name}

                            {category.sub_categories?.length > 0 && (
                                <svg
                                    className="h-3.5 w-3.5 text-gray-400 transition group-hover:text-indigo-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            )}
                        </Link>

                        {category.sub_categories?.length > 0 && (
                            <div className="invisible absolute left-0 top-full z-40 min-w-56 -translate-y-1 rounded-md border border-gray-100 bg-white py-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                {category.sub_categories.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={route('products.index', {
                                            category: category.slug,
                                            subcategory: sub.slug,
                                        })}
                                        className="block whitespace-nowrap px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
