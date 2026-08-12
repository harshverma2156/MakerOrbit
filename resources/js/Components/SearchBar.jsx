import { router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Site-wide product search shown in the header on every page (see
 * AppLayout). Always submits to the product listing. Reads the current
 * URL directly (rather than a prop) so it works the same whether it's
 * rendered on the Home page, the listing itself, or anywhere else —
 * and, when already on the listing, preserves whatever category/
 * sub-category filter is active so searching doesn't clear it.
 */
export default function SearchBar() {
    const params = new URLSearchParams(window.location.search);
    const [query, setQuery] = useState(params.get('search') ?? '');

    const submit = (e) => {
        e.preventDefault();

        if (!query.trim()) {
            return;
        }

        router.get(
            route('products.index'),
            {
                search: query || undefined,
                category: params.get('category') || undefined,
                subcategory: params.get('subcategory') || undefined,
            },
            { preserveState: true },
        );
    };

    return (
        <form onSubmit={submit} className="flex w-full items-center gap-2">
            <div className="relative flex-1">
                <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search motors, sensors, microcontrollers…"
                    className="w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
            <button
                type="submit"
                disabled={!query.trim()}
                className="inline-flex shrink-0 items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:hover:bg-indigo-300"
            >
                Search
            </button>
        </form>
    );
}
