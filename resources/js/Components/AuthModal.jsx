import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthModal({ show, onClose }) {
    const [mode, setMode] = useState('login'); // 'login' | 'register'

    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submitLogin = (e) => {
        e.preventDefault();
        loginForm.post(route('login'), {
            onFinish: () => loginForm.reset('password'),
        });
    };

    const submitRegister = (e) => {
        e.preventDefault();
        registerForm.post(route('register'), {
            onFinish: () =>
                registerForm.reset('password', 'password_confirmation'),
        });
    };

    return (
        <Modal show={show} onClose={onClose} closeable={false} maxWidth="md">
            <div className="relative p-6">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close and browse without an account"
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="pr-8 text-lg font-semibold text-gray-900">
                    {mode === 'login'
                        ? 'Log in to MakerOrbit'
                        : 'Create your account'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    {mode === 'login'
                        ? 'Log in to track orders and check out faster.'
                        : 'Sign up to save your cart and track orders.'}
                </p>

                <div className="mt-4 flex gap-2 rounded-md bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                            mode === 'login'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Log in
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                            mode === 'register'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Sign up
                    </button>
                </div>

                {mode === 'login' ? (
                    <form className="mt-6" onSubmit={submitLogin}>
                        <div>
                            <InputLabel htmlFor="modal-email" value="Email" />
                            <TextInput
                                id="modal-email"
                                type="email"
                                name="email"
                                value={loginForm.data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused
                                onChange={(e) =>
                                    loginForm.setData('email', e.target.value)
                                }
                            />
                            <InputError
                                message={loginForm.errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="modal-password"
                                value="Password"
                            />
                            <TextInput
                                id="modal-password"
                                type="password"
                                name="password"
                                value={loginForm.data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) =>
                                    loginForm.setData(
                                        'password',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={loginForm.errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={loginForm.data.remember}
                                    onChange={(e) =>
                                        loginForm.setData(
                                            'remember',
                                            e.target.checked,
                                        )
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>

                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <PrimaryButton
                            className="mt-6 w-full justify-center"
                            disabled={loginForm.processing}
                        >
                            Log in
                        </PrimaryButton>
                    </form>
                ) : (
                    <form className="mt-6" onSubmit={submitRegister}>
                        <div>
                            <InputLabel htmlFor="modal-name" value="Name" />
                            <TextInput
                                id="modal-name"
                                name="name"
                                value={registerForm.data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused
                                onChange={(e) =>
                                    registerForm.setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={registerForm.errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="modal-register-email"
                                value="Email"
                            />
                            <TextInput
                                id="modal-register-email"
                                type="email"
                                name="email"
                                value={registerForm.data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) =>
                                    registerForm.setData(
                                        'email',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={registerForm.errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="modal-register-password"
                                value="Password"
                            />
                            <TextInput
                                id="modal-register-password"
                                type="password"
                                name="password"
                                value={registerForm.data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    registerForm.setData(
                                        'password',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={registerForm.errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="modal-password_confirmation"
                                value="Confirm Password"
                            />
                            <TextInput
                                id="modal-password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={registerForm.data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    registerForm.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={
                                    registerForm.errors.password_confirmation
                                }
                                className="mt-2"
                            />
                        </div>

                        <PrimaryButton
                            className="mt-6 w-full justify-center"
                            disabled={registerForm.processing}
                        >
                            Create account
                        </PrimaryButton>
                    </form>
                )}
            </div>
        </Modal>
    );
}
