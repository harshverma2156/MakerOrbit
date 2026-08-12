const STAR_PATH =
    'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0l-4.725 2.885a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z';

/**
 * Five-star rating display with partial fill (e.g. a 3.7 average renders
 * the fourth star 70% full), used on ProductCard, the product listing,
 * and the product page's review summary. Purely presentational — pass
 * `null`/`undefined` rating when a product has no reviews yet.
 */
export default function StarRating({
    rating,
    count,
    size = 'h-4 w-4',
    showCount = true,
    className = '',
}) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const hasReviews = Number(count) > 0;

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <div className="flex" role="img" aria-label={`${safeRating.toFixed(1)} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => {
                    const fillPercent =
                        Math.max(0, Math.min(1, safeRating - index)) * 100;

                    return (
                        <span key={index} className={`relative ${size}`}>
                            <svg
                                viewBox="0 0 24 24"
                                className={`absolute inset-0 h-full w-full text-gray-300`}
                            >
                                <path d={STAR_PATH} fill="currentColor" />
                            </svg>
                            <span
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillPercent}%` }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-full w-full text-amber-400"
                                >
                                    <path d={STAR_PATH} fill="currentColor" />
                                </svg>
                            </span>
                        </span>
                    );
                })}
            </div>

            {showCount && (
                <span className="text-xs text-gray-500">
                    {hasReviews
                        ? `${safeRating.toFixed(1)} (${count})`
                        : 'No reviews yet'}
                </span>
            )}
        </div>
    );
}
