import ApplicationLogo from '@/Components/ApplicationLogo';
import AuthModal from '@/Components/AuthModal';
import CategoryMegaMenu from '@/Components/CategoryMegaMenu';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const AUTH_MODAL_DISMISSED_KEY = 'makerorbit_auth_modal_dismissed';

export default function AppLayout({ title, children }) {
    const user = usePage().props.auth?.user;
    const categoryNav = usePage().props.categoryNav ?? [];

    const canManageCatalog =
        user?.role === 'super_admin' || user?.role === 'product_manager';
    const canViewOrders =
        user?.role === 'super_admin' ||
        user?.role === 'order_manager' ||
        user?.role === 'support_staff';
    const canManageStaff = user?.role === 'super_admin';
    const isStaff = canManageCatalog || canViewOrders || canManageStaff;
    const activeCategorySlug = new URLSearchParams(
        window.location.search,
    ).get('category');

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [showAuthModal, setShowAuthModal] = useState(
        () =>
            !user &&
            window.sessionStorage.getItem(AUTH_MODAL_DISMISSED_KEY) !== '1',
    );

    const closeAuthModal = () => {
        window.sessionStorage.setItem(AUTH_MODAL_DISMISSED_KEY, '1');
        setShowAuthModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {title && <Head title={title} />}

            {!user && (
                <AuthModal show={showAuthModal} onClose={closeAuthModal} />
            )}

            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center gap-2">
                                <Link
                                    href={route('home')}
                                    className="flex items-center gap-2"
                                >
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-indigo-600" />
                                    <span className="text-lg font-bold tracking-tight text-gray-900">
                                        MakerOrbit
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('products.index')}
                                    active={route().current('products.*')}
                                >
                                    Products
                                </NavLink>

                                {user && (
                                    <>
                                        <NavLink
                                            href={route('cart.index')}
                                            active={route().current('cart.*')}
                                        >
                                            Cart
                                        </NavLink>
                                        <NavLink
                                            href={route('orders.index')}
                                            active={route().current(
                                                'orders.*',
                                            )}
                                        >
                                            Orders
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:gap-4">
                            {user ? (
                                <>
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                    >
                                        Dashboard
                                    </NavLink>

                                    {isStaff && (
                                        <div className="relative">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="inline-flex rounded-md">
                                                        <button
                                                            type="button"
                                                            className={`inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out focus:outline-none ${
                                                                route().current(
                                                                    'admin.*',
                                                                )
                                                                    ? 'text-gray-900'
                                                                    : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                        >
                                                            Admin
                                                            <svg
                                                                className="-me-0.5 ms-2 h-4 w-4"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    {canManageCatalog && (
                                                        <>
                                                            <Dropdown.Link
                                                                href={route(
                                                                    'admin.categories.index',
                                                                )}
                                                            >
                                                                Categories
                                                            </Dropdown.Link>
                                                            <Dropdown.Link
                                                                href={route(
                                                                    'admin.products.index',
                                                                )}
                                                            >
                                                                Products
                                                            </Dropdown.Link>
                                                        </>
                                                    )}
                                                    {canViewOrders && (
                                                        <Dropdown.Link
                                                            href={route(
                                                                'admin.orders.index',
                                                            )}
                                                        >
                                                            Orders
                                                        </Dropdown.Link>
                                                    )}
                                                    {canManageStaff && (
                                                        <Dropdown.Link
                                                            href={route(
                                                                'admin.staff.index',
                                                            )}
                                                        >
                                                            Staff &amp; Roles
                                                        </Dropdown.Link>
                                                    )}
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    )}

                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                    >
                                                        {user.name}

                                                        <svg
                                                            className="-me-0.5 ms-2 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route(
                                                        'profile.edit',
                                                    )}
                                                >
                                                    Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                >
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hidden border-t border-gray-100 bg-gray-50 sm:block">
                    <CategoryMegaMenu categories={categoryNav} />
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('products.index')}
                            active={
                                route().current('products.*') &&
                                !activeCategorySlug
                            }
                        >
                            All Products
                        </ResponsiveNavLink>

                        {categoryNav.map((category) => (
                            <ResponsiveNavLink
                                key={category.id}
                                href={route('products.index', {
                                    category: category.slug,
                                })}
                                active={activeCategorySlug === category.slug}
                            >
                                {category.name}
                            </ResponsiveNavLink>
                        ))}

                        {user && (
                            <>
                                <ResponsiveNavLink
                                    href={route('cart.index')}
                                    active={route().current('cart.*')}
                                >
                                    Cart
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('orders.index')}
                                    active={route().current('orders.*')}
                                >
                                    Orders
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </ResponsiveNavLink>
                                {canManageCatalog && (
                                    <>
                                        <ResponsiveNavLink
                                            href={route(
                                                'admin.categories.index',
                                            )}
                                            active={route().current(
                                                'admin.categories.*',
                                            )}
                                        >
                                            Admin: Categories
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route(
                                                'admin.products.index',
                                            )}
                                            active={route().current(
                                                'admin.products.*',
                                            )}
                                        >
                                            Admin: Products
                                        </ResponsiveNavLink>
                                    </>
                                )}
                                {canViewOrders && (
                                    <ResponsiveNavLink
                                        href={route('admin.orders.index')}
                                        active={route().current(
                                            'admin.orders.*',
                                        )}
                                    >
                                        Admin: Orders
                                    </ResponsiveNavLink>
                                )}
                                {canManageStaff && (
                                    <ResponsiveNavLink
                                        href={route('admin.staff.index')}
                                        active={route().current(
                                            'admin.staff.*',
                                        )}
                                    >
                                        Admin: Staff &amp; Roles
                                    </ResponsiveNavLink>
                                )}
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        {user ? (
                            <>
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink
                                        href={route('profile.edit')}
                                    >
                                        Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1">
                                <ResponsiveNavLink href={route('login')}>
                                    Log in
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')}>
                                    Register
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}
