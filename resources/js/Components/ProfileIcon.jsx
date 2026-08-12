/**
 * Shared account/profile glyph used in the header's profile dropdown
 * trigger (see AppLayout). Single-color, `currentColor`-driven so it
 * inherits whatever text color class the caller applies — same
 * convention as CartIcon.
 */
export default function ProfileIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <circle cx="12" cy="8" r="3.5" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5c1.3-3.7 4.3-5.5 7.5-5.5s6.2 1.8 7.5 5.5"
            />
        </svg>
    );
}
