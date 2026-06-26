import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { Head } from '@inertiajs/react';

export default function Home({ auth }: { auth: any }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Home
                </h2>
            }
        >
            <Head title="Home" />

            <ChatLayout>
                <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        <h3 className="mb-2 text-2xl font-medium text-gray-400 dark:text-gray-500">
                            Welcome to Messenger
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Select a conversation to start chatting
                        </p>
                    </div>
                </div>
            </ChatLayout>
        </AuthenticatedLayout>
    );
}