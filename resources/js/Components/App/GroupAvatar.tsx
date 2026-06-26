import { UsersIcon } from "@heroicons/react/24/outline";

interface GroupAvatarProps {
    group: {
        id: number;
        name: string;
    };
}

export default function GroupAvatar({ group }: GroupAvatarProps) {
    return (
        <div className="chat-image avatar placeholder">
            <div className="bg-slate-700 text-slate-200 w-8 h-8 rounded-full flex items-center justify-center">
                <UsersIcon className="w-4 h-4 text-slate-400" />
            </div>
        </div>
    );
}