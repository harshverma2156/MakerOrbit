const STEPS = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'completed', label: 'Delivered' },
];

/**
 * Horizontal step tracker for an order's lifecycle (Placed → Processing
 * → Shipped → Delivered), shown on both the customer and admin order
 * detail pages in place of a flat status badge. `cancelled` is a
 * separate terminal state, not a step on this line, so it renders as
 * its own banner instead.
 */
export default function OrderTrackingTimeline({ status }) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <svg
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                    />
                </svg>
                This order was cancelled.
            </div>
        );
    }

    const activeIndex = Math.max(
        0,
        STEPS.findIndex((step) => step.key === status),
    );

    return (
        <div className="overflow-x-auto">
            <div className="flex min-w-[480px] items-center">
                {STEPS.map((step, index) => {
                    const isComplete = index <= activeIndex;
                    const isLast = index === STEPS.length - 1;

                    return (
                        <div
                            key={step.key}
                            className={`flex items-center ${isLast ? '' : 'flex-1'}`}
                        >
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                                        isComplete
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    {isComplete ? (
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span
                                    className={`whitespace-nowrap text-xs font-medium ${
                                        isComplete
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {!isLast && (
                                <div
                                    className={`mx-2 h-0.5 flex-1 ${
                                        index < activeIndex
                                            ? 'bg-indigo-600'
                                            : 'bg-gray-200'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
