import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
    if (req.method !== "DELETE" || req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const profile = await currentProfilePages();
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        if (!profile) return res.status(401).json({ error: "Unauthorized" });

        if (!messageId) return res.status(400).json({ error: "Message Id Missing" });

        if (!serverId) return res.status(400).json({ error: "Message Id Missing" });

        if (!channelId) return res.status(400).json({ error: "Message Id Missing" });

        const servers = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });
        if (!servers) return res.status(404).json({ error: "Server Not Missing" });

        const channels = await db.channel.findFirst({
            where: {
                id: channelId,
                serverId: serverId
            }
        });
        if (!channels) return res.status(404).json({ error: "Channel Not Missing" });

        const member = servers.members.find(m => m.profileId === profile.id);
        if (!member) return res.status(404).json({ error: "Member Not Missing" });

        const message = await db.message.findFirst({
            where: {
                id: messageId,
                channelId: channelId
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        if (!message || message.deleted) return res.status(404).json({ error: "Message Not Missing" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Error" })
    }

}
