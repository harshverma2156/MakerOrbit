/**
 * Shared shopping-cart glyph used both in the header (top-right cart
 * button) and on product cards (quick add-to-cart). Single-color,
 * `currentColor`-driven so it inherits whatever text color class the
 * caller applies.
 */
export default function CartIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 8 9 4h6l1 4M5 8h14l-2 8H7L5 8Z"
            />
            <circle cx="9" cy="19" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="15" cy="19" r="1.4" fill="currentColor" stroke="none" />
        </svg>
    );
}
