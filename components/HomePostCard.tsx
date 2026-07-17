"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioSettings } from "@/context/AudioSettingsContext";

interface PostCardProps {
    post_id: string,
    nickname: string,
    username: string,
    user_pfp: string,

    song_title: string,
    song_artist: string,
    song_albumImage: string,
    song_spotifyUrl: string,
    song_previewUrl: string | null,

    comment: string,

    isExpanded: boolean,
    onClickEvent: (post_id: string) => void
}

const FADE_MS = 350;
const FALLBACK_DURATION = 30;

export default function HomePostCard({
    post_id, nickname, username, user_pfp,
    song_title, song_artist, song_albumImage, song_spotifyUrl, song_previewUrl,
    comment, isExpanded, onClickEvent
}: PostCardProps) {
    const { isMuted } = useAudioSettings();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeFrameRef = useRef<number | null>(null);
    const [progress, setProgress] = useState(0); // 0 a 1

    const cancelFade = () => {
        if (fadeFrameRef.current !== null) {
            cancelAnimationFrame(fadeFrameRef.current);
            fadeFrameRef.current = null;
        }
    };

    const fadeTo = (target: number, onComplete?: () => void) => {
        const audio = audioRef.current;
        if (!audio) return;

        cancelFade();
        const start = audio.volume;
        const startTime = performance.now();

        const step = (now: number) => {
            const t = Math.min(1, (now - startTime) / FADE_MS);
            const nextVolume = start + (target - start) * t;

            audio.volume = Math.min(1, Math.max(0, nextVolume));

            if (t < 1) {
                fadeFrameRef.current = requestAnimationFrame(step);
            } else {
                fadeFrameRef.current = null;
                audio.volume = Math.min(1, Math.max(0, target));
                onComplete?.();
            }
        };

        fadeFrameRef.current = requestAnimationFrame(step);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !song_previewUrl) return;

        if (isExpanded) {
            audio.currentTime = 0;
            audio.volume = 0;
            audio.muted = isMuted;
            audio.play().catch(() => {
            });
            fadeTo(1);
        } else {
            fadeTo(0, () => {
                audio.pause();
                audio.currentTime = 0;
                setProgress(0);
            });
        }

        return () => cancelFade();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded, song_previewUrl]);

    useEffect(() => {
        return () => {
            cancelFade();
            audioRef.current?.pause();
        };
    }, []);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;
        const duration = audio.duration && isFinite(audio.duration) ? audio.duration : FALLBACK_DURATION;
        setProgress(Math.min(1, audio.currentTime / duration));
    };

    const handleCardClick = () => {
        if (!isExpanded && song_previewUrl && audioRef.current) {
            audioRef.current.play().catch(() => {});
        }
        onClickEvent(post_id);
    };

    return (
        <div id={`${post_id}`} className="py-1 px-5" style={{ containerType: 'inline-size' }}>
            <div
                className="relative flex flex-col w-full aspect-square rounded-2xl shadow-sm overflow-hidden min-h-[5rem] transition-all duration-500 ease-in-out origin-top"
                style={{
                    minHeight: '7rem',
                    maxHeight: isExpanded ? 'min(100cqw, 400px)' : '5rem'
                }}
                onClick={handleCardClick}
            >
                {song_previewUrl && (
                    <audio
                        ref={audioRef}
                        src={song_previewUrl}
                        preload="none"
                        onTimeUpdate={handleTimeUpdate}
                    />
                )}

                {song_albumImage ? (
                    <>
                        <div
                            className="absolute -inset-px bg-cover bg-center z-0 transition-all duration-500"
                            style={{ backgroundImage: `url(${song_albumImage})` }}
                        />
                        <div className="absolute -inset-px bg-gradient-to-b from-background/90 via-background/80 to-background/50 z-0" />
                    </>
                ) : (
                    <div className="absolute -inset-px bg-background-light z-0" />
                )}

                <div className="relative z-10 flex w-full" style={{ cursor: 'pointer' }}>
                    <div className="pl-5 pt-5 pb-2 flex flex-col flex-1 pr-4">
                        <h3 className="text-text-main font-bold text-lg">{song_title}</h3>
                        <p className="text-text-muted text-sm">{song_artist}</p>
                    </div>

                    <div className="p-4 flex items-start flex-shrink-0">
                        <img
                            src={user_pfp ? user_pfp : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"}
                            alt={`Foto de perfil de ${username}`}
                            className="w-10 h-10 object-cover rounded-full border border-gray-600/50"
                        />
                    </div>
                </div>

                <div
                    className={`relative z-10 px-5 pt-2 pb-5 flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ${
                        isExpanded ? "opacity-100 delay-200" : "opacity-0"
                    }`}
                >
                    {comment ? (
                        <div className="pt-20">
                            <p className="text-text-main text-sm italic border-gray-400/50 pl-3 text-l"><b>{username}</b> disse...</p>
                            <p className="text-text-main break-words text-sm italic border-gray-400/50 pb-3 px-3 text-xl">
                                "{comment}"
                            </p>
                        </div>
                    ) : (
                        <div className="pt-20">
                            <p className="text-text-main text-sm italic border-gray-400/50 pl-3 text-l"><b>{username}</b> escutou essa música...</p>
                        </div>
                    )}
                </div>

                {song_previewUrl && (
                    <div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 transition-opacity duration-300 ${
                            isExpanded ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}