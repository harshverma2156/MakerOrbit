import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const MAX_IMAGES = 5;

const RETURN_POLICIES = [
    { value: 'none', label: 'No returns or replacements' },
    { value: 'returnable', label: 'Returnable' },
    { value: 'replaceable', label: 'Replaceable only' },
    { value: 'both', label: 'Returnable & replaceable' },
];

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        sub_category_id: '',
        features: [''],
        description: '',
        images: [],
        specification_url: '',
        return_policy: 'none',
        return_window_days: '',
        mrp: '',
        price: '',
        cod_available: true,
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const selectedCategory = categories.find(
        (category) => String(category.id) === String(data.category_id),
    );
    const subCategoryOptions = selectedCategory?.sub_categories ?? [];

    const discountPercent = useMemo(() => {
        const mrp = parseFloat(data.mrp);
        const price = parseFloat(data.price);

        if (!mrp || !price || mrp <= price) {
            return null;
        }

        return Math.round((1 - price / mrp) * 100);
    }, [data.mrp, data.price]);

    const addFeatureField = () => {
        setData('features', [...data.features, '']);
    };

    const updateFeature = (index, value) => {
        const next = [...data.features];
        next[index] = value;
        setData('features', next);
    };

    const removeFeature = (index) => {
        setData(
            'features',
            data.features.filter((_, i) => i !== index),
        );
    };

    const addImages = (fileList) => {
        const incoming = Array.from(fileList);
        const room = MAX_IMAGES - data.images.length;
        const accepted = incoming.slice(0, Math.max(room, 0));

        if (accepted.length === 0) {
            return;
        }

        setData('images', [...data.images, ...accepted]);
        setImagePreviews((prev) => [
            ...prev,
            ...accepted.map((file) => URL.createObjectURL(file)),
        ]);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setData(
            'images',
            data.images.filter((_, i) => i !== index),
        );
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();

        // Drop blank feature rows rather than sending empty strings.
        const cleanedFeatures = data.features
            .map((f) => f.trim())
            .filter(Boolean);

        setData('features', cleanedFeatures);

        post(route('admin.products.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout title="Add Product">
            <Head title="Add Product" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href={route('admin.products.index')}
                    className="mb-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                    &larr; Back to Products
                </Link>

                <h1 className="text-2xl font-bold text-gray-900">
                    Add Product
                </h1>

                <form
                    onSubmit={submit}
                    className="mt-6 space-y-8 rounded-md border border-gray-200 bg-white p-6 shadow-sm"
                >
                    {/* Title */}
                    <div>
                        <InputLabel htmlFor="name" value="Title" />
                        <TextInput
                            id="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            isFocused
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Category / Sub-category */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="category_id" value="Category" />
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) => {
                                    setData('category_id', e.target.value);
                                    setData('sub_category_id', '');
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">
                                    Select a category&hellip;
                                </option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
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
                                htmlFor="sub_category_id"
                                value="Sub-Category"
                            />
                            <select
                                id="sub_category_id"
                                value={data.sub_category_id}
                                onChange={(e) =>
                                    setData(
                                        'sub_category_id',
                                        e.target.value,
                                    )
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

                    {/* Features */}
                    <div>
                        <InputLabel value="Features" />
                        <p className="mt-1 text-xs text-gray-500">
                            Short highlights shown as bullet points, e.g.
                            "12-bit ADC" or "Bluetooth 5.0".
                        </p>

                        <div className="mt-2 space-y-2">
                            {data.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <TextInput
                                        value={feature}
                                        placeholder={`Feature ${index + 1}`}
                                        className="block w-full"
                                        onChange={(e) =>
                                            updateFeature(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature(index)}
                                        aria-label="Remove feature"
                                        className="shrink-0 text-gray-400 hover:text-red-600"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addFeatureField}
                            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            + Add feature
                        </button>
                        <InputError message={errors.features} className="mt-2" />
                    </div>

                    {/* Description */}
                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    {/* Photos */}
                    <div>
                        <InputLabel
                            value={`Photos (up to ${MAX_IMAGES})`}
                        />

                        <div className="mt-2 flex flex-wrap gap-3">
                            {imagePreviews.map((src, index) => (
                                <div
                                    key={src}
                                    className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200"
                                >
                                    <img
                                        src={src}
                                        alt={`Upload preview ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        aria-label="Remove photo"
                                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}

                            {data.images.length < MAX_IMAGES && (
                                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 text-xs text-gray-400 hover:border-indigo-400 hover:text-indigo-500">
                                    + Add
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            addImages(e.target.files);
                                            e.target.value = '';
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        <InputError message={errors.images} className="mt-2" />
                        <InputError message={errors['images.0']} className="mt-1" />
                    </div>

                    {/* Specification link */}
                    <div>
                        <InputLabel
                            htmlFor="specification_url"
                            value="Specification Hyperlink"
                        />
                        <TextInput
                            id="specification_url"
                            type="url"
                            placeholder="https://example.com/datasheet.pdf"
                            value={data.specification_url}
                            className="mt-1 block w-full"
                            onChange={(e) =>
                                setData('specification_url', e.target.value)
                            }
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Link to the full spec sheet or datasheet, shown
                            to customers as "Full specifications".
                        </p>
                        <InputError
                            message={errors.specification_url}
                            className="mt-2"
                        />
                    </div>

                    {/* Return policy */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel
                                htmlFor="return_policy"
                                value="Return Policy"
                            />
                            <select
                                id="return_policy"
                                value={data.return_policy}
                                onChange={(e) =>
                                    setData('return_policy', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                {RETURN_POLICIES.map((policy) => (
                                    <option
                                        key={policy.value}
                                        value={policy.value}
                                    >
                                        {policy.label}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.return_policy}
                                className="mt-2"
                            />
                        </div>

                        {data.return_policy !== 'none' && (
                            <div>
                                <InputLabel
                                    htmlFor="return_window_days"
                                    value="Return/Replacement Window (days)"
                                />
                                <TextInput
                                    id="return_window_days"
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={data.return_window_days}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            'return_window_days',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.return_window_days}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>

                    {/* Pricing */}
                    <div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <InputLabel
                                    htmlFor="mrp"
                                    value="Real Price (MRP)"
                                />
                                <TextInput
                                    id="mrp"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Optional — enables the discount badge"
                                    value={data.mrp}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('mrp', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.mrp}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="price"
                                    value="Current Price"
                                />
                                <TextInput
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.price}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {discountPercent !== null && (
                            <div className="mt-3 flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                                <span className="font-semibold">
                                    {discountPercent}% OFF
                                </span>
                                <span className="text-green-600">
                                    Customers will see{' '}
                                    <span className="line-through">
                                        {currencyFormatter.format(
                                            parseFloat(data.mrp),
                                        )}
                                    </span>{' '}
                                    {currencyFormatter.format(
                                        parseFloat(data.price),
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Cash on delivery */}
                    <div className="flex items-center gap-2">
                        <input
                            id="cod_available"
                            type="checkbox"
                            checked={data.cod_available}
                            onChange={(e) =>
                                setData('cod_available', e.target.checked)
                            }
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        />
                        <InputLabel
                            htmlFor="cod_available"
                            value="Cash on Delivery available"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                        <SecondaryButton
                            onClick={() =>
                                (window.location.href = route(
                                    'admin.products.index',
                                ))
                            }
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            Add Product
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
