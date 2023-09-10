import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import ServerHeader from "./server-header";

import { redirect } from "next/navigation";

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
    </div>
}

export default ServerSidebar;