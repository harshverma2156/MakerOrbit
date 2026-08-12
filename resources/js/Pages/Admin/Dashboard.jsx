import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function CardIcon({ path }) {
    return (
        <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    );
}

function DashboardCard({ icon, title, description, onClick, href }) {
    const body = (
        <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <CardIcon path={icon} />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">
                {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </>
    );

    const className =
        'flex flex-col rounded-md border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md';

    if (href) {
        return (
            <Link href={href} className={className}>
                {body}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={className}>
            {body}
        </button>
    );
}

function AddSubCategoryModal({ show, onClose, categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category_id: '',
    });

    const cancel = () => {
        reset();
        onClose(false);
    };

    const submit = (e) => {
        e.preventDefault();

        if (!data.category_id) {
            return;
        }

        post(route('admin.sub-categories.store', data.category_id), {
            onSuccess: () => {
                reset();
                onClose(true);
            },
        });
    };

    return (
        <Modal show={show} onClose={cancel} maxWidth="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Add Sub-Category
                </h2>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="sub-category-name"
                        value="Title"
                    />
                    <TextInput
                        id="sub-category-name"
                        value={data.name}
                        className="mt-1 block w-full"
                        isFocused
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="sub-category-category"
                        value="Category"
                    />
                    <select
                        id="sub-category-category"
                        value={data.category_id}
                        onChange={(e) =>
                            setData('category_id', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select a category&hellip;</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <InputError
                        message={errors.category_id}
                        className="mt-2"
                    />
                    {categories.length === 0 && (
                        <p className="mt-2 text-sm text-gray-500">
                            No categories yet — create one first.
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={cancel}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton
                        disabled={processing || !data.category_id}
                    >
                        Add Sub-Category
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

export default function Dashboard({ categories }) {
    const user = usePage().props.auth?.user;
    const [showAddSubCategory, setShowAddSubCategory] = useState(false);
    const [justCreated, setJustCreated] = useState(false);

    const canManageCatalog =
        user?.role === 'super_admin' || user?.role === 'product_manager';
    const canViewOrders =
        user?.role === 'super_admin' ||
        user?.role === 'order_manager' ||
        user?.role === 'support_staff';
    const canManageStaff = user?.role === 'super_admin';

    const closeSubCategoryModal = (created) => {
        setShowAddSubCategory(false);
        if (created) {
            setJustCreated(true);
            setTimeout(() => setJustCreated(false), 4000);
        }
    };

    return (
        <AppLayout title="Admin">
            <Head title="Admin" />

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Admin
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your catalog, orders, and staff from here.
                    </p>
                </div>

                {justCreated && (
                    <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        Sub-category created.
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {canManageCatalog && (
                        <DashboardCard
                            title="Categories"
                            description="Create and manage product categories."
                            href={route('admin.categories.index')}
                            icon="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                        />
                    )}

                    {canManageCatalog && (
                        <DashboardCard
                            title="Sub-Category"
                            description="Add a sub-category under an existing category."
                            onClick={() => setShowAddSubCategory(true)}
                            icon="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15 7.5 7.5-7.5 7.5"
                        />
                    )}

                    {canManageCatalog && (
                        <DashboardCard
                            title="Products"
                            description="Browse products and add new ones to the catalog."
                            href={route('admin.products.index')}
                            icon="M20.25 7.5l-8.25 4.5L3.75 7.5M20.25 7.5l-8.25-4.5L3.75 7.5M20.25 7.5v9l-8.25 4.5m0-13.5v13.5m0-13.5L3.75 7.5m8.25 13.5L3.75 16.5v-9"
                        />
                    )}

                    {canViewOrders && (
                        <DashboardCard
                            title="Orders"
                            description="View every order placed by customers."
                            href={route('admin.orders.index')}
                            icon="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.87-4.716 2.226-7.216a1.125 1.125 0 00-1.11-1.284H6.911M7.5 14.25L5.106 5.272M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                    )}

                    {canManageStaff && (
                        <DashboardCard
                            title="Staff & Roles"
                            description="Assign admin roles to registered users."
                            href={route('admin.staff.index')}
                            icon="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.941-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        />
                    )}
                </div>
            </div>

            <AddSubCategoryModal
                show={showAddSubCategory}
                onClose={(created) => closeSubCategoryModal(created)}
                categories={categories}
            />
        </AppLayout>
    );
}
