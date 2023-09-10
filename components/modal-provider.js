"use client";

import { useState, useEffect } from "react";

import CreateServerModal from "./modal/create-server-modal";
import InviteModal from "./modal/invite-modal";
import EditServerModal from "./modal/edit-server-modal";
import MembersManageModal from "./modal/members-manage-modal";

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
    </>
}