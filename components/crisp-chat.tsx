"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("fdac66be-c8f9-473e-b280-837c04d37e5e");
    }, []);

    return null;
}