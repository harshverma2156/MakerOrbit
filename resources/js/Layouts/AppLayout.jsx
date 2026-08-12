import ApplicationLogo from '@/Components/ApplicationLogo';
import AuthModal from '@/Components/AuthModal';
import CartIcon from '@/Components/CartIcon';
import CategoryMegaMenu from '@/Components/CategoryMegaMenu';
import Dropdown from '@/Components/Dropdown';
import Footer from '@/Components/Footer';
import ProfileIcon from '@/Components/ProfileIcon';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SearchBar from '@/Components/SearchBar';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const AUTH_MODAL_DISMISSED_KEY = 'makerorbit_auth_modal_dismissed';

export default function AppLayout({ title, children }) {
    const user = usePage().props.auth?.user;
    const categoryNav = usePage().props.categoryNav ?? [];
    const previewingAsCustomer = usePage().props.previewingAsCustomer ?? false;
    const cartItemCount = usePage().props.cartItemCount ?? 0;

    // Real role, regardless of preview mode — controls whether the
    // Switch to Customer/Admin button itself shows at all.
    const isRealStaff =
        user?.role === 'super_admin' ||
        user?.role === 'product_manager' ||
        user?.role === 'order_manager' ||
        user?.role === 'support_staff';

    // While previewing as a customer, hide every admin-only nav item so
    // the storefront looks exactly like what a real customer would see.
    const canManageCatalog =
        !previewingAsCustomer &&
        (user?.role === 'super_admin' || user?.role === 'product_manager');
    const canViewOrders =
        !previewingAsCustomer &&
        (user?.role === 'super_admin' ||
            user?.role === 'order_manager' ||
            user?.role === 'support_staff');
    const canManageStaff = !previewingAsCustomer && user?.role === 'super_admin';
    const activeCategorySlug = new URLSearchParams(
        window.location.search,
    ).get('category');

    // Mobile-only drawer for the category list (the mega menu row is
    // hidden below `sm`, since it doesn't fit narrow screens).
    const [showingCategoryMenu, setShowingCategoryMenu] = useState(false);

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
        <div className="flex min-h-screen flex-col bg-gray-100">
            {title && <Head title={title} />}

            {!user && (
                <AuthModal show={showAuthModal} onClose={closeAuthModal} />
            )}

            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Main header row: logo, search bar + button, profile,
                        cart — in that order, per the site's header spec. */}
                    <div className="flex h-16 items-center gap-3 sm:gap-6">
                        <Link
                            href={route('home')}
                            className="flex shrink-0 items-center gap-2"
                        >
                            <ApplicationLogo className="block h-9 w-auto fill-current text-indigo-600" />
                            <span className="hidden text-lg font-bold tracking-tight text-gray-900 sm:inline">
                                MakerOrbit
                            </span>
                        </Link>

                        {/* Always takes the remaining space so profile/cart
                            stay pinned right; the search bar itself only
                            renders here from `sm` up — on mobile it moves
                            to its own full-width row below. */}
                        <div className="flex-1">
                            <div className="hidden sm:block">
                                <SearchBar />
                            </div>
                        </div>

                        <div className="shrink-0">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        title={
                                            user
                                                ? `Signed in as ${user.name}`
                                                : 'Account'
                                        }
                                        className="inline-flex items-center rounded-md p-2 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                    >
                                        <ProfileIcon className="h-6 w-6" />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    {user ? (
                                        <>
                                            <div className="border-b border-gray-100 px-4 py-2 text-sm text-gray-500">
                                                Signed in as{' '}
                                                <span className="font-medium text-gray-900">
                                                    {user.name}
                                                </span>
                                            </div>

                                            {isRealStaff &&
                                                (previewingAsCustomer ? (
                                                    <Dropdown.Link
                                                        href={route(
                                                            'preview-mode.disable',
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        title="Testing tool: return to the admin view"
                                                    >
                                                        Switch to Admin
                                                    </Dropdown.Link>
                                                ) : (
                                                    <Dropdown.Link
                                                        href={route(
                                                            'preview-mode.enable',
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        title="Testing tool: see the site as a customer would"
                                                    >
                                                        Switch to Customer
                                                    </Dropdown.Link>
                                                ))}

                                            <Dropdown.Link
                                                href={route('dashboard')}
                                            >
                                                Dashboard
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                My Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('orders.index')}
                                            >
                                                My Orders
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    'wishlist.index',
                                                )}
                                            >
                                                My Wishlist
                                            </Dropdown.Link>

                                            {canManageCatalog && (
                                                <>
                                                    <Dropdown.Link
                                                        href={route(
                                                            'admin.categories.index',
                                                        )}
                                                    >
                                                        Admin: Categories
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            'admin.products.index',
                                                        )}
                                                    >
                                                        Admin: Products
                                                    </Dropdown.Link>
                                                </>
                                            )}
                                            {canViewOrders && (
                                                <Dropdown.Link
                                                    href={route(
                                                        'admin.orders.index',
                                                    )}
                                                >
                                                    Admin: Orders
                                                </Dropdown.Link>
                                            )}
                                            {canManageStaff && (
                                                <Dropdown.Link
                                                    href={route(
                                                        'admin.staff.index',
                                                    )}
                                                >
                                                    Admin: Staff &amp; Roles
                                                </Dropdown.Link>
                                            )}

                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </>
                                    ) : (
                                        <>
                                            <Dropdown.Link
                                                href={route('login')}
                                            >
                                                Log in
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('register')}
                                            >
                                                Register
                                            </Dropdown.Link>
                                        </>
                                    )}
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Cart routes require auth, so there's nowhere for
                            this to link a guest to — same as before. */}
                        {user && (
                            <Link
                                href={route('cart.index')}
                                title="Cart"
                                className={`relative inline-flex shrink-0 items-center rounded-md p-2 transition duration-150 ease-in-out focus:outline-none ${
                                    route().current('cart.*')
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <CartIcon className="h-6 w-6" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                                        {cartItemCount > 99
                                            ? '99+'
                                            : cartItemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        <button
                            onClick={() =>
                                setShowingCategoryMenu(
                                    (previousState) => !previousState,
                                )
                            }
                            title="Browse categories"
                            className="-me-2 inline-flex shrink-0 items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none sm:hidden"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingCategoryMenu
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
                                        showingCategoryMenu
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

                {/* Search bar: own full-width row, mobile only (shown
                    inline in the row above from `sm` up). */}
                <div className="border-t border-gray-100 bg-white px-4 py-3 sm:hidden">
                    <SearchBar />
                </div>

                {/* Categories: shown right below the header row, on every
                    page. Desktop gets the hover mega menu; mobile gets a
                    toggled drawer since the menu doesn't fit narrow screens. */}
                <div className="hidden border-t border-gray-100 bg-gray-50 sm:block">
                    <CategoryMegaMenu categories={categoryNav} />
                </div>

                <div
                    className={
                        (showingCategoryMenu ? 'block' : 'hidden') +
                        ' border-t border-gray-100 sm:hidden'
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
                    </div>
                </div>
            </nav>

            <main className="flex-1">{children}</main>

            <Footer categories={categoryNav} user={user} />
        </div>
    );
}
