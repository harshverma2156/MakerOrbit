/**
 * The MakerOrbit mark: a robot head with a circuit-trace antenna and a
 * tilted orbit ring passing behind it. Single-color by design — every
 * shape uses `currentColor`/`fill="#fff"` for the eye "cutouts" so it
 * inherits whatever text color class the caller applies (see usages in
 * AppLayout, GuestLayout, Footer), the same convention the previous
 * default Breeze mark used.
 */
export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Orbit ring, passing behind the head */}
            <ellipse
                cx="36"
                cy="48"
                rx="42"
                ry="11"
                transform="rotate(-16 36 48)"
                stroke="currentColor"
                strokeWidth="3.5"
            />
            <circle cx="3" cy="57" r="4.2" fill="currentColor" />

            {/* Antenna: filled tip, two open circuit nodes, down into the head */}
            <circle cx="20" cy="4" r="3.5" fill="currentColor" />
            <path
                d="M20 4L31 14L43 9L50 24"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="31"
                cy="14"
                r="3"
                fill="#fff"
                stroke="currentColor"
                strokeWidth="2.2"
            />
            <circle
                cx="43"
                cy="9"
                r="2.6"
                fill="#fff"
                stroke="currentColor"
                strokeWidth="2"
            />

            {/* Head */}
            <rect
                x="10"
                y="26"
                width="50"
                height="38"
                rx="14"
                stroke="currentColor"
                strokeWidth="5"
            />

            {/* Eyes */}
            <rect x="19" y="41" width="18" height="11" rx="5.5" fill="currentColor" />
            <circle cx="25" cy="46.5" r="2" fill="#fff" />
            <circle cx="32" cy="46.5" r="2" fill="#fff" />
            <circle cx="50" cy="46" r="6.5" fill="currentColor" />
        </svg>
    );
}
