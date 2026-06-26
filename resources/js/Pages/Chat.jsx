import { usePage } from '@inertiajs/react';
import ChatLayout from '@/Layouts/ChatLayout';

const Chat = () => {
    const { selectedConversation } = usePage().props;

    return (
        <div className="flex h-full flex-col bg-slate-900">
            <div className="border-b border-gray-700 bg-slate-800 p-4">
                <h2 className="text-lg font-semibold text-white">
                    {selectedConversation?.name || 'Select a conversation'}
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 text-gray-400">
                {selectedConversation ? (
                    <p>Chat with {selectedConversation.name} (messages coming soon)</p>
                ) : (
                    <p className="text-center mt-20">Select a user or group from the sidebar</p>
                )}
            </div>

            <div className="border-t border-gray-700 bg-slate-800 p-4">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="input input-bordered w-full"
                    disabled={!selectedConversation}
                />
            </div>
        </div>
    );
};

// This is critical for layout persistence
Chat.layout = (page: any) => <ChatLayout>{page}</ChatLayout>;

export default Chat;