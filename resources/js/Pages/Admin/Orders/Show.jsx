import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const STATUSES = ['pending', 'processing', 'completed', 'cancelled'];

export default function Show({ order, canUpdateStatus }) {
    const items = order?.items ?? [];
    const [status, setStatus] = useState(order?.status ?? 'pending');
    const [saving, setSaving] = useState(false);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(value) || 0);

    const formatDate = (value) =>
        value
            ? new Date(value).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
              })
            : '';

    const updateStatus = (newStatus) => {
        setStatus(newStatus);
        setSaving(true);

        router.patch(
            route('admin.orders.update', order.id),
            { status: newStatus },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <AppLayout title={`Order ${order?.order_number ?? ''}`}>
            <Head title={`Order ${order?.order_number ?? ''}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    <Link
                        href={route('admin.orders.index')}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        &larr; Back to Orders
                    </Link>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-md">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">
                                    Order {order?.order_number}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Placed on {formatDate(order?.created_at)}{' '}
                                    by {order?.user?.name} (
                                    {order?.user?.email})
                                </p>
                            </div>

                            {canUpdateStatus ? (
                                <select
                                    value={status}
                                    disabled={saving}
                                    onChange={(e) =>
                                        updateStatus(e.target.value)
                                    }
                                    className={`rounded-full border-0 px-3 py-1 text-xs font-semibold capitalize focus:ring-2 focus:ring-indigo-500 ${
                                        statusStyles[status] ??
                                        'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {STATUSES.map((value) => (
                                        <option
                                            key={value}
                                            value={value}
                                            className="bg-white text-gray-900"
                                        >
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                        statusStyles[status] ??
                                        'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {status}
                                </span>
                            )}
                        </div>

                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Shipping Address
                            </h2>
                            <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                                {order?.shipping_address}
                            </p>
                        </div>

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
                                                {item.product_name}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {formatCurrency(
                                                    item.unit_price,
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {formatCurrency(
                                                    item.line_total,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="space-y-1 border-t border-gray-200 px-6 py-4 text-right">
                            <p className="text-sm text-gray-500">
                                Subtotal: {formatCurrency(order?.subtotal)}
                            </p>
                            <p className="text-base font-semibold text-gray-900">
                                Total: {formatCurrency(order?.total)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
