import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(req, res) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!directMessageId)
      return res.status(400).json({ error: "Direct Message Id Missing" });

    if (!conversationId)
      return res.status(400).json({ error: "Conversation Id Missing" });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          //Either of the two members has to be us
          { memberOne: { profileId: profile.id } },
          { memberTwo: { profileId: profile.id } },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found!" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) return res.status(404).json({ message: "Member not found!" });

    let message = await db.directMessage.findFirst({
      where: {
        id: directMessageId,
        conversationId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted)
      return res.status(404).json({ error: "Message not found" });

    const isMessageowner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageowner || isAdmin || isModerator;

    if (!canModify) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === "DELETE") {
      message = await db.directMessage.update({
        where: {
          id: directMessageId,
        },
        data: {
          fileUrl: null,
          content: "This message is deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageowner)
        return res.status(401).json({ error: "Unauthorized" });

      message = await db.directMessage.update({
        where: {
          id: directMessageId,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    const updateKey = `chat:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json({ message });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Error" });
  }
}
