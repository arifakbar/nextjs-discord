"use client";

import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";


const ServerHeader = ({ server, role }) => {

    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
            <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                {server.name}
                <ChevronDown className="h-5 w-5 ml-auto" />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 dark:bg-black text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
            {isModerator && (
                <DropdownMenuItem
                    onClick={() => onOpen("invite", { server })}
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                    Invite People
                    <UserPlus className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
            )}
            {isAdmin && (
                <DropdownMenuItem
                    onClick={() => onOpen("editServer", { server })}
                    className="hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition px-3 py-2 text-sm cursor-pointer">
                    Server Settings
                    <Settings className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
            )}
            {isAdmin && (
                <DropdownMenuItem
                    onClick={() => onOpen("membersManage", { server })}
                    className="hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition px-3 py-2 text-sm cursor-pointer">
                    Manage Members
                    <Users className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
            )}
            {isModerator && (
                <DropdownMenuItem
                    onClick={() => onOpen("createChannel", { server })}
                    className="hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition px-3 py-2 text-sm cursor-pointer">
                    Create Channels
                    <PlusCircle className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
            )}
            {isModerator && (<DropdownMenuSeparator className="mx-2 bg-zinc-700" />)}
            {isAdmin && (
                <DropdownMenuItem className="hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition text-rose-500 dark:text-rose-500 px-3 py-2 text-sm cursor-pointer">
                    Delete Server
                    <Trash className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
            )}
            {!isAdmin && (
                <DropdownMenuItem className="hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition text-rose-500 dark:text-rose-500 px-3 py-2 text-sm cursor-pointer">
                    Leave Server
                    <LogOut className="h-4 w-4 ml-auto" />
                </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
}

export default ServerHeader;