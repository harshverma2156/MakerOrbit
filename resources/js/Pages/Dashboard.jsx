import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard">
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="mb-4 text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
