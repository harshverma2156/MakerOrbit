import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ cart }) {
    const items = cart?.items ?? [];
    const isEmpty = items.length === 0;

    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
        0
    );

    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(value) || 0);

    const handleQuantityChange = (item, quantity) => {
        const parsed = Math.max(1, parseInt(quantity, 10) || 1);

        router.patch(
            route('cart.update', item.id),
            { quantity: parsed },
            { preserveScroll: true }
        );
    };

    const handleRemove = (item) => {
        router.delete(route('cart.destroy', item.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Your Cart">
            <Head title="Your Cart" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-md">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h1 className="text-lg font-semibold text-gray-900">
                                Your Cart
                            </h1>
                        </div>

                        {isEmpty ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-500">
                                    Your cart is empty.
                                </p>
                                <Link
                                    href="/"
                                    className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Unit Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Quantity
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                    Line Total
                                                </th>
                                                <th className="px-6 py-3" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {item.product?.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {formatCurrency(
                                                            item.product?.price
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    item,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {formatCurrency(
                                                            Number(
                                                                item.product
                                                                    ?.price ??
                                                                    0
                                                            ) * item.quantity
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemove(
                                                                    item
                                                                )
                                                            }
                                                            className="font-medium text-red-600 hover:text-red-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                                    <span className="text-base font-semibold text-gray-900">
                                        Subtotal: {formatCurrency(subtotal)}
                                    </span>
                                    <Link
                                        href={route('checkout.create')}
                                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
