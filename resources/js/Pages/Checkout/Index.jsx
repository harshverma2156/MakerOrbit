import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ cart }) {
    const items = cart?.items ?? [];

    const total = items.reduce(
        (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
        0
    );

    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(value) || 0);

    const { data, setData, post, processing, errors } = useForm({
        shipping_address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    return (
        <AppLayout title="Checkout">
            <Head title="Checkout" />

            <div className="py-12">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-md">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Order Summary
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Qty
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Line Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {item.product?.name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {formatCurrency(
                                                    Number(
                                                        item.product?.price ??
                                                            0
                                                    ) * item.quantity
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                            <span className="text-base font-semibold text-gray-900">
                                Total
                            </span>
                            <span className="text-base font-semibold text-gray-900">
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-md">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Shipping Address
                            </h2>
                        </div>

                        <form onSubmit={submit} className="space-y-4 px-6 py-6">
                            <div>
                                <label
                                    htmlFor="shipping_address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Shipping Address
                                </label>
                                <textarea
                                    id="shipping_address"
                                    name="shipping_address"
                                    rows={5}
                                    value={data.shipping_address}
                                    onChange={(e) =>
                                        setData(
                                            'shipping_address',
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Street, city, state, postal code"
                                />
                                {errors.shipping_address && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.shipping_address}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing || items.length === 0}
                                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Place Order
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
