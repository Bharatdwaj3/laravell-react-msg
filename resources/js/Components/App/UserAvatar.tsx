interface UserAvatarProps {
    user: {
        id: number;
        name: string;
        avatar_url?: string | null;
    };
    online?: boolean | null;
    profile?: boolean;
}

export default function UserAvatar({ user, online = null, profile = false }: UserAvatarProps) {
    const sizeClass = profile ? "w-40" : "w-8";

    const initials = user.name
        ? user.name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
        : "??";

    return (
        <div className="relative inline-flex shrink-0">
            {user.avatar_url ? (
                <div className={`rounded-full overflow-hidden ${sizeClass}`}>
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className={`bg-slate-700 text-slate-200 rounded-full flex items-center justify-center uppercase ${sizeClass} ${profile ? "text-4xl font-bold" : "text-xs font-semibold"}`}>
                    <span>{initials}</span>
                </div>
            )}

            {online === true && (
                <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-slate-800" />
            )}
            {online === false && (
                <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-slate-500 ring-2 ring-slate-800" />
            )}
        </div>
    );
}