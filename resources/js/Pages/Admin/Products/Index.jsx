import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function AddProductModal({ show, onClose, categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        description: '',
        category_id: '',
        sub_category_id: '',
    });

    const selectedCategory = categories.find(
        (category) => String(category.id) === String(data.category_id),
    );
    const subCategoryOptions = selectedCategory?.sub_categories ?? [];

    const close = () => {
        reset();
        onClose();
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.products.store'), {
            onSuccess: close,
        });
    };

    return (
        <Modal show={show} onClose={close} maxWidth="lg">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Add Product
                </h2>

                <div className="mt-4">
                    <InputLabel htmlFor="product-name" value="Title" />
                    <TextInput
                        id="product-name"
                        value={data.name}
                        className="mt-1 block w-full"
                        isFocused
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="product-price" value="Price (USD)" />
                    <TextInput
                        id="product-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('price', e.target.value)}
                    />
                    <InputError message={errors.price} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="product-description"
                        value="Description"
                    />
                    <textarea
                        id="product-description"
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

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel
                            htmlFor="product-category"
                            value="Category"
                        />
                        <select
                            id="product-category"
                            value={data.category_id}
                            onChange={(e) => {
                                setData('category_id', e.target.value);
                                setData('sub_category_id', '');
                            }}
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
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="product-sub-category"
                            value="Sub-category"
                        />
                        <select
                            id="product-sub-category"
                            value={data.sub_category_id}
                            onChange={(e) =>
                                setData('sub_category_id', e.target.value)
                            }
                            disabled={!selectedCategory}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400 sm:text-sm"
                        >
                            <option value="">
                                {selectedCategory
                                    ? 'Select a sub-category (optional)…'
                                    : 'Choose a category first'}
                            </option>
                            {subCategoryOptions.map((sub) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.sub_category_id}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={close}>Cancel</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        Add Product
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

export default function Index({ products, categories }) {
    const [showAddProduct, setShowAddProduct] = useState(false);

    const hasCategories = useMemo(() => categories.length > 0, [categories]);

    const deleteProduct = (product) => {
        if (!window.confirm(`Delete "${product.name}"?`)) {
            return;
        }

        router.delete(route('admin.products.destroy', product.id));
    };

    return (
        <AppLayout title="Manage Products">
            <Head title="Manage Products" />

            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Products
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage the{' '}
                            <Link
                                href={route('admin.categories.index')}
                                className="text-indigo-600 underline hover:text-indigo-500"
                            >
                                categories &amp; sub-categories
                            </Link>{' '}
                            first, then add products to them here.
                        </p>
                    </div>

                    <PrimaryButton
                        onClick={() => setShowAddProduct(true)}
                        disabled={!hasCategories}
                        title={
                            hasCategories
                                ? undefined
                                : 'Add a category first'
                        }
                    >
                        + Add Product
                    </PrimaryButton>
                </div>

                <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                    {products.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No products yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {product.category?.name}
                                                {product.sub_category && (
                                                    <span className="text-gray-400">
                                                        {' '}
                                                        &rsaquo;{' '}
                                                        {
                                                            product
                                                                .sub_category
                                                                .name
                                                        }
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {currencyFormatter.format(
                                                    product.price,
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {product.stock_quantity}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteProduct(product)
                                                    }
                                                    className="font-medium text-red-600 hover:text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <AddProductModal
                show={showAddProduct}
                onClose={() => setShowAddProduct(false)}
                categories={categories}
            />
        </AppLayout>
    );
}
