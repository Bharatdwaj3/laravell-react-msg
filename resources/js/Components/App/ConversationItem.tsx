import { usePage, Link } from '@inertiajs/react';
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formatMessageDateShort } from "../../../js/helpers"; 

interface ConversationItemProps {
    conversation: {
        id: number;
        name: string;
        is_user: boolean;
        is_group: boolean;
        is_admin?: boolean;
        created_at: string;
        updated_at: string;
        blocked_at?: string | null;
        last_message?: string | null;
        last_message_date?: string | null;
        description?: string | null;
    };
    selectedConversation?: {
        id: number;
        is_user: boolean;
        is_group: boolean;
    } | null;
    online?: boolean | null;
}   

export default function ConversationItem({
    conversation,
    selectedConversation = null,
    online = null,
}: ConversationItemProps) {
    const page = usePage();
    let isSelected = false;

    if (selectedConversation) {
        if (selectedConversation.is_group && conversation.is_group) {
            isSelected = selectedConversation.id === conversation.id;
        } else if (selectedConversation.is_user && conversation.is_user) {
            isSelected = selectedConversation.id === conversation.id;
        }
    }

    return (
        <Link
            href={
                conversation.is_user
                    ? route("chat.user", conversation.id)
                    : route("chat.group", conversation.id)
            }
            preserveState
            className={
                "flex items-center gap-3 p-3 transition-colors cursor-pointer border-b border-slate-800/40 hover:bg-slate-800/30 relative group " +
                (isSelected ? "bg-slate-800/60" : "")
            }
        >
            {conversation.is_user && (
                <UserAvatar user={conversation} online={online} />
            )}
            {conversation.is_group && (
                <GroupAvatar group={conversation} />
            )}

            <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h3 className="text-sm font-medium text-slate-200 truncate">
                        {conversation.name}
                    </h3>
                    {conversation.last_message_date && (
                        <span className="text-xs text-slate-500 font-light shrink-0">
                            {formatMessageDateShort(conversation.last_message_date)}
                        </span>
                    )}
                </div>
                
                {conversation.last_message ? (
                    <p className="text-xs text-slate-400 truncate">
                        {conversation.last_message}
                    </p>
                ) : (
                    <p className="text-xs text-slate-500 italic truncate">
                        No messages yet
                    </p>
                )}
            </div>

            {conversation.is_user && (
                <UserOptionsDropdown conversation={conversation} />
            )}
        </Link>
    );
}