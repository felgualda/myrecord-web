"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "myrecord_muted";

interface AudioSettingsContextValue {
    isMuted: boolean;
    setMuted: (muted: boolean) => void;
    toggleMuted: () => void;
}

const AudioSettingsContext = createContext<AudioSettingsContextValue | undefined>(undefined);

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            setIsMuted(saved === "true");
        }
    }, []);

    const setMuted = (muted: boolean) => {
        setIsMuted(muted);
        localStorage.setItem(STORAGE_KEY, String(muted));
    };

    const toggleMuted = () => setMuted(!isMuted);

    return (
        <AudioSettingsContext.Provider value={{ isMuted, setMuted, toggleMuted }}>
            {children}
        </AudioSettingsContext.Provider>
    );
}

export function useAudioSettings() {
    const ctx = useContext(AudioSettingsContext);
    if (!ctx) {
        throw new Error("useAudioSettings deve ser usado dentro de um AudioSettingsProvider");
    }
    return ctx;
}
