"use client";

import { useState, useEffect } from "react";

import CreateServerModal from "./modal/create-server-modal";
import InviteModal from "./modal/invite-modal";
import EditServerModal from "./modal/edit-server-modal";
import MembersManageModal from "./modal/members-manage-modal";
import CreateChannelModal from "./modal/create-channel-modal";
import LeaveServerModal from "./modal/leave-server-modal";
import DeleteServerModal from "./modal/delete-server-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) return null;

    return <>
        <CreateServerModal />
        <InviteModal />
        <EditServerModal />
        <MembersManageModal />
        <CreateChannelModal />
        <LeaveServerModal />
        <DeleteServerModal />
    </>
}