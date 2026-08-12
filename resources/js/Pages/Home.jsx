import ProductCard from '@/Components/ProductCard';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

const features = [
    {
        title: 'Curated Robot Parts',
        description:
            'Motors, sensors, microcontrollers, and structural kits picked for real builds — not just spec sheets.',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17 4.677 21.923A2.652 2.652 0 0 1 1 18.246l6.877-6.877m0 0-2.5-2.5m2.5 2.5 5.877-5.877a2.652 2.652 0 0 0 0-3.75 2.652 2.652 0 0 0-3.75 0L5.75 6" />
        ),
    },
    {
        title: 'Detailed Specs',
        description:
            'Every part lists voltage, weight, torque, dimensions, and compatibility so it fits your design first try.',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3-15H6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 6 21h9.75a2.25 2.25 0 0 0 2.25-2.25V6.75L15.75 3Z"
            />
        ),
    },
    {
        title: 'Built for Makers',
        description:
            'From weekend hobby bots to competition robots — stock quantities and pricing that scale with your project.',
        icon: (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v1.5m18 0v10.5A2.25 2.25 0 0 1 18.75 21H5.25A2.25 2.25 0 0 1 3 18V7.5m18 0H3m6 4.5h6"
            />
        ),
    },
];

export default function Home({ featuredProducts }) {
    return (
        <AppLayout title="Home">
            <div className="bg-gradient-to-b from-indigo-50 to-white">
                <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        MakerOrbit
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        Robot parts for makers. Motors, sensors,
                        microcontrollers, chassis kits, and everything else
                        your build needs.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Shop Parts
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-md border border-gray-200 bg-white p-6 text-center shadow-sm"
                        >
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    {feature.icon}
                                </svg>
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {featuredProducts && featuredProducts.length > 0 && (
                <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Featured Parts
                        </h2>
                        <Link
                            href={route('products.index')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            View all &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
