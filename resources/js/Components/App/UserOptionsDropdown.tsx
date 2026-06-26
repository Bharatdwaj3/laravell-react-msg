import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisVerticalIcon, ShieldCheckIcon, UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";

interface UserOptionsDropdownProps {
    conversation: {
        id: number;
        name: string;
        is_user: boolean;
        is_group: boolean;
        is_admin?: boolean;
        blocked_at?: string | null;
    };
}

export default function UserOptionsDropdown({ conversation }: UserOptionsDropdownProps) {
    const changeAdminStatus = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!conversation.is_user) return;
        router.post(route("user.changeAdminStatus", conversation.id));
    };

    const toggleBlockUser = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); 
        if (!conversation.is_user) return;
        router.post(route("user.blockUnblock", conversation.id));
    };

    return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-slate-900 border border-slate-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={changeAdminStatus}
                                        className={`${
                                            active ? "bg-slate-800 text-white" : "text-slate-300"
                                        } group flex w-full items-center rounded-md px-3 py-2 text-xs font-medium transition-colors gap-2`}
                                    >
                                        <ShieldCheckIcon className="w-4 h-4 text-slate-400" />
                                        {conversation.is_admin ? "Remove Admin" : "Make Admin"}
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={toggleBlockUser}
                                        className={`${
                                            active ? "bg-red-950/40 text-red-400" : "text-slate-300"
                                        } group flex w-full items-center rounded-md px-3 py-2 text-xs font-medium transition-colors gap-2`}
                                    >
                                        {conversation.blocked_at ? (
                                            <>
                                                <UserPlusIcon className="w-4 h-4 text-slate-400" />
                                                Unblock User
                                            </>
                                        ) : (
                                            <>
                                                <UserMinusIcon className="w-4 h-4 text-red-400/70" />
                                                Block User
                                            </>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}