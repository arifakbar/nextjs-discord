import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "./server-header";

import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4" />,
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4" />,
}


const ServerSidebar = async ({ serverId }) => {

    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: { orderBy: { createdAt: "asc" } },
            members: { include: { profile: true }, orderBy: { role: "asc" } },
        }
    });

    if (!server) return redirect("/");

    //Seprating channels by their type
    const textChannels = server?.channels.filter((c) => c.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((c) => c.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((c) => c.type === ChannelType.VIDEO);

    const members = server?.members.filter((m) => m.profileId !== profile.id); //Filtering out current user

    const role = server?.members.find((m) => m.profileId === profile.id)?.role; //Find user role in the channel

    return <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
        <ServerHeader server={server} role={role} />
        <ScrollArea className="flex-1 px-3" >
            <div className="mt-2">
                <ServerSearch data={[
                    {
                        label: "Text Channels",
                        type: "channel",
                        data: textChannels?.map(c => ({
                            id: c.id,
                            name: c.name,
                            icon: iconMap[c.type]
                        }))
                    },
                    {
                        label: "Audio Channels",
                        type: "channel",
                        data: audioChannels?.map(c => ({
                            id: c.id,
                            name: c.name,
                            icon: iconMap[c.type]
                        }))
                    },
                    {
                        label: "Video Channels",
                        type: "channel",
                        data: videoChannels?.map(c => ({
                            id: c.id,
                            name: c.name,
                            icon: iconMap[c.type]
                        }))
                    },
                    {
                        label: "Members",
                        type: "member",
                        data: members?.map(m => ({
                            id: m.id,
                            name: m.profile.name,
                            icon: roleIconMap[m.role]
                        }))
                    },
                ]} />
            </div>
        </ScrollArea  >
    </div>
}

export default ServerSidebar;