import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

/**
 * Site-wide footer shown at the bottom of every page (see AppLayout).
 * Mirrors the header's category list so the storefront nav is
 * reachable from the bottom of long pages too.
 */
export default function Footer({ categories, user }) {
    const year = new Date().getFullYear();
    const topCategories = (categories ?? []).slice(0, 6);

    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ApplicationLogo className="h-8 w-auto fill-current text-indigo-600" />
                            <span className="text-lg font-bold tracking-tight text-gray-900">
                                MakerOrbit
                            </span>
                        </div>
                        <p className="mt-3 max-w-xs text-sm text-gray-500">
                            Robot parts for makers — motors, sensors,
                            microcontrollers, chassis kits, and everything
                            else your build needs.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                            Quick Links
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                            <li>
                                <Link
                                    href={route('products.index')}
                                    className="hover:text-indigo-600"
                                >
                                    All Products
                                </Link>
                            </li>
                            {user ? (
                                <>
                                    <li>
                                        <Link
                                            href={route('cart.index')}
                                            className="hover:text-indigo-600"
                                        >
                                            Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route('orders.index')}
                                            className="hover:text-indigo-600"
                                        >
                                            My Orders
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route('profile.edit')}
                                            className="hover:text-indigo-600"
                                        >
                                            My Profile
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href={route('login')}
                                            className="hover:text-indigo-600"
                                        >
                                            Log in
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route('register')}
                                            className="hover:text-indigo-600"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                            Categories
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                            {topCategories.length > 0 ? (
                                topCategories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={route('products.index', {
                                                category: category.slug,
                                            })}
                                            className="hover:text-indigo-600"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-400">
                                    No categories yet
                                </li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                            Get in Touch
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-gray-500">
                            <li>support@makerorbit.test</li>
                            <li>Mon–Fri, 9am–6pm</li>
                        </ul>
                        <div className="mt-4 flex items-center gap-3">
                            {['X', 'IG', 'YT'].map((label) => (
                                <span
                                    key={label}
                                    title={`MakerOrbit on ${label}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
                    &copy; {year} MakerOrbit. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
