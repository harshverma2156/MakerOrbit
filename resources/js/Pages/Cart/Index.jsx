import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value) || 0);

/**
 * A line's "real" (MRP) unit price only counts as higher than its
 * current price when that's an actual discount — otherwise the real
 * price is just the current price, the same convention used on
 * ProductCard/Products/Show so cart totals never appear to invent a
 * discount that doesn't exist.
 */
function lineFigures(item) {
    const price = parseFloat(item.product?.price) || 0;
    const mrp = parseFloat(item.product?.mrp);
    const realUnitPrice = mrp && mrp > price ? mrp : price;

    return {
        price,
        realUnitPrice,
        hasDiscount: mrp && mrp > price,
        lineCurrentTotal: price * item.quantity,
        lineRealTotal: realUnitPrice * item.quantity,
    };
}

export default function Index({ cart }) {
    const items = cart?.items ?? [];
    const isEmpty = items.length === 0;

    const totals = items.reduce(
        (acc, item) => {
            const { lineCurrentTotal, lineRealTotal } = lineFigures(item);

            return {
                current: acc.current + lineCurrentTotal,
                real: acc.real + lineRealTotal,
            };
        },
        { current: 0, real: 0 },
    );

    const totalSaved = totals.real - totals.current;
    const percentSaved =
        totals.real > 0 ? Math.round((totalSaved / totals.real) * 100) : 0;

    const handleQuantityChange = (item, quantity) => {
        const parsed = Math.max(1, parseInt(quantity, 10) || 1);

        router.patch(
            route('cart.update', item.id),
            { quantity: parsed },
            { preserveScroll: true },
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
                                                    Price
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
                                            {items.map((item) => {
                                                const {
                                                    price,
                                                    realUnitPrice,
                                                    hasDiscount,
                                                    lineCurrentTotal,
                                                } = lineFigures(item);

                                                return (
                                                    <tr key={item.id}>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                {item.product
                                                                    ?.image_path && (
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .product
                                                                                .image_path
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .product
                                                                                .name
                                                                        }
                                                                        className="h-12 w-12 rounded-md border border-gray-200 object-cover"
                                                                    />
                                                                )}
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            <span className="font-medium text-gray-900">
                                                                {formatCurrency(
                                                                    price,
                                                                )}
                                                            </span>
                                                            {hasDiscount && (
                                                                <span className="ml-2 text-gray-400 line-through">
                                                                    {formatCurrency(
                                                                        realUnitPrice,
                                                                    )}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    handleQuantityChange(
                                                                        item,
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                            {formatCurrency(
                                                                lineCurrentTotal,
                                                            )}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemove(
                                                                        item,
                                                                    )
                                                                }
                                                                className="font-medium text-red-600 hover:text-red-500"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex flex-col gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <dl className="space-y-1 text-sm">
                                        {totalSaved > 0 && (
                                            <div className="flex items-center gap-2">
                                                <dt className="text-gray-500">
                                                    Total Real Price:
                                                </dt>
                                                <dd className="text-gray-400 line-through">
                                                    {formatCurrency(
                                                        totals.real,
                                                    )}
                                                </dd>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <dt className="text-base font-semibold text-gray-900">
                                                Total:
                                            </dt>
                                            <dd className="text-base font-semibold text-gray-900">
                                                {formatCurrency(
                                                    totals.current,
                                                )}
                                            </dd>
                                        </div>
                                        {totalSaved > 0 && (
                                            <div className="flex items-center gap-2">
                                                <dt className="sr-only">
                                                    You saved
                                                </dt>
                                                <dd className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-sm font-semibold text-green-700">
                                                    You saved{' '}
                                                    {formatCurrency(
                                                        totalSaved,
                                                    )}{' '}
                                                    ({percentSaved}% off)
                                                </dd>
                                            </div>
                                        )}
                                    </dl>

                                    <Link
                                        href={route('checkout.create')}
                                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
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
