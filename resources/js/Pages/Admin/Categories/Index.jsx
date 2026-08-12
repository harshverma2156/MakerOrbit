import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function AddSubCategoryForm({ category }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.sub-categories.store', category.id), {
            preserveScroll: true,
            onSuccess: () => reset('name'),
        });
    };

    return (
        <form onSubmit={submit} className="flex items-start gap-2">
            <div className="flex-1">
                <TextInput
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="New sub-category name"
                    className="block w-full text-sm"
                />
                <InputError message={errors.name} className="mt-1" />
            </div>
            <SecondaryButton type="submit" disabled={processing}>
                Add
            </SecondaryButton>
        </form>
    );
}

function AddCategoryModal({ show, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.categories.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Add Category
                </h2>

                <div className="mt-4">
                    <InputLabel htmlFor="category-name" value="Name" />
                    <TextInput
                        id="category-name"
                        value={data.name}
                        className="mt-1 block w-full"
                        isFocused
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="category-description"
                        value="Description (optional)"
                    />
                    <textarea
                        id="category-description"
                        value={data.description}
                        onChange={(e) =>
                            setData('description', e.target.value)
                        }
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <InputError
                        message={errors.description}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        Create Category
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

export default function Index({ categories }) {
    const [showAddCategory, setShowAddCategory] = useState(false);

    const deleteCategory = (category) => {
        if (
            !window.confirm(
                `Delete "${category.name}"? Its sub-categories will be deleted too.`,
            )
        ) {
            return;
        }

        router.delete(route('admin.categories.destroy', category.id));
    };

    const deleteSubCategory = (subCategory) => {
        if (!window.confirm(`Delete "${subCategory.name}"?`)) {
            return;
        }

        router.delete(route('admin.sub-categories.destroy', subCategory.id));
    };

    return (
        <AppLayout title="Manage Categories">
            <Head title="Manage Categories" />

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Categories
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Create categories and their sub-categories, then
                            head to{' '}
                            <Link
                                href={route('admin.products.index')}
                                className="text-indigo-600 underline hover:text-indigo-500"
                            >
                                Products
                            </Link>{' '}
                            to add items to them.
                        </p>
                    </div>

                    <PrimaryButton onClick={() => setShowAddCategory(true)}>
                        + Add Category
                    </PrimaryButton>
                </div>

                {categories.length === 0 ? (
                    <div className="rounded-md border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-500">
                            No categories yet. Add one to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="rounded-md border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {category.name}
                                        </h2>
                                        {category.description && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                    <DangerButton
                                        onClick={() =>
                                            deleteCategory(category)
                                        }
                                    >
                                        Delete
                                    </DangerButton>
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Sub-categories
                                    </h3>

                                    {category.sub_categories.length > 0 && (
                                        <ul className="mt-2 flex flex-wrap gap-2">
                                            {category.sub_categories.map(
                                                (sub) => (
                                                    <li
                                                        key={sub.id}
                                                        className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
                                                    >
                                                        {sub.name}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                deleteSubCategory(
                                                                    sub,
                                                                )
                                                            }
                                                            aria-label={`Delete ${sub.name}`}
                                                            className="text-indigo-400 hover:text-indigo-700"
                                                        >
                                                            &times;
                                                        </button>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}

                                    <div className="mt-3 max-w-sm">
                                        <AddSubCategoryForm
                                            category={category}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddCategoryModal
                show={showAddCategory}
                onClose={() => setShowAddCategory(false)}
            />
        </AppLayout>
    );
}
