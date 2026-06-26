/* eslint-disable react-hooks/exhaustive-deps */
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConversationItem from '../Components/App/ConversationItem'; // Imported the sub-component

interface ChatLayoutProps  {
    children: React.ReactNode;
    conversations?: any[];
    selectedConversation?: any;
}

interface Conversation {
    id: number;
    name: string;
    is_group: boolean;  
    is_user: boolean; 
    created_at: string; 
    updated_at: string; 
    blocked_at?: string | null;
    is_admin?: boolean;
    is_online?: boolean;
    last_message?: string | null;
    last_message_date?: string | null;
    description?: string | null;
    avatar_url?: string | null;
}
const ChatLayout = ({ children }: ChatLayoutProps) => {
    const page = usePage();

    const conversations = (page.props.conversations as Conversation[]) || [];
    const selectedConversation = page.props.selectedConversation as
        | Conversation
        | undefined;

    const [localConversations, setLocalConversations] = useState<Conversation[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [onlineUsers, setOnlineUsers] = useState<Record<string | number, any>>({});
    const [sortedConversations, setSortedConversation] = useState<Conversation[]>([]);

    const isUserOnline = (userId: string | number) => !!onlineUsers[userId];

    const onSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const search = ev.target.value.toLowerCase().trim();
        setSearchQuery(search);
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            }),
        );
    };

    useEffect(() => {
        setSortedConversation(
            [...localConversations].sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
                
                const dateA = a.last_message_date || '';
                const dateB = b.last_message_date || '';
                if (dateA && dateB) {
                    return dateB.localeCompare(dateA);
                } else if (dateA) {
                    return -1;
                } else if (dateB) {
                    return 1;
                }
                return 0;
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
    const channel = (window as any).Echo.join('online')
        .here((users: any[]) => {
            const onlineUsersObj = Object.fromEntries(
                users.map((user: any) => [user.id, user])
            );
            setOnlineUsers((prevOnlineUsers) => ({
                ...prevOnlineUsers,
                ...onlineUsersObj
            }));
        })
        .joining((user: any) => {
            setOnlineUsers((prevOnlineUsers) => ({
                ...prevOnlineUsers,
                [user.id]: user
            }));
        })
        .leaving((user: any) => {
            setOnlineUsers((prevOnlineUsers) => {
                const updatedUsers = { ...prevOnlineUsers };
                delete updatedUsers[user.id];
                return updatedUsers;
            });
        })
        .error((error: any) => {
            console.log('Echo error', error);
        });

    return () => {
        (window as any).Echo.leave('online');
    };
}, []);
    
    return (
        <div className="flex h-full w-full flex-1 overflow-hidden">
            <div
                className={`flex w-full flex-col overflow-hidden bg-slate-800 transition-all sm:w-[320px] md:w-[360px] ${
                    selectedConversation ? '-ml-[100%] sm:ml-0' : ''
                }`}
            >
                <div className="flex items-center justify-between px-3 py-2 text-xl font-medium text-gray-200">
                    Conversations
                    <div className="tooltip tooltip-left" data-tip="Create new Group">
                        <button className="text-gray-400 hover:text-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={onSearch}
                        placeholder="Filter users and groups"
                        className="input input-bordered input-sm w-full"
                    />
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2">
                    {sortedConversations &&
                        sortedConversations.map((conversation) => (
                            <ConversationItem 
                                key={`${conversation.is_group ? 'group_' : 'user_'}${conversation.id}`}
                                conversation={conversation}
                                selectedConversation={selectedConversation}
                                online={conversation.is_user ? isUserOnline(conversation.id) : null}
                            />
                        ))}
                </div>
            </div>
            
            <div className="flex flex-1 flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default ChatLayout;