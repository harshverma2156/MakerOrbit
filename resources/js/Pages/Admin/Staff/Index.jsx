import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ users, roles }) {
    const currentUserId = usePage().props.auth?.user?.id;
    const [savingId, setSavingId] = useState(null);
    const [errors, setErrors] = useState({});

    const changeRole = (user, role) => {
        setSavingId(user.id);
        setErrors((prev) => ({ ...prev, [user.id]: null }));

        router.patch(
            route('admin.staff.update', user.id),
            { role },
            {
                preserveScroll: true,
                onError: (pageErrors) =>
                    setErrors((prev) => ({
                        ...prev,
                        [user.id]: pageErrors.role,
                    })),
                onFinish: () => setSavingId(null),
            },
        );
    };

    return (
        <AppLayout title="Manage Staff">
            <Head title="Manage Staff" />

            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Staff &amp; Roles
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Assign who can manage the catalog, orders, or
                        customer support. Everyone starts as a customer.
                    </p>
                </div>

                <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Role
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {user.name}
                                            {user.id === currentUserId && (
                                                <span className="ms-2 text-xs font-normal text-gray-400">
                                                    (you)
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <select
                                                value={user.role}
                                                disabled={
                                                    savingId === user.id
                                                }
                                                onChange={(e) =>
                                                    changeRole(
                                                        user,
                                                        e.target.value,
                                                    )
                                                }
                                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                {roles.map((role) => (
                                                    <option
                                                        key={role.value}
                                                        value={role.value}
                                                    >
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[user.id] && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {errors[user.id]}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
