"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioSettings } from "@/context/AudioSettingsContext";

interface PostCardProps {
    post_id: string;
    nickname: string;
    username: string;
    user_pfp: string;

    song_title: string;
    song_artist: string;
    song_albumImage: string;
    song_spotifyUrl: string | null;
    song_deezerUrl: string | null;
    song_appleMusicUrl: string | null;
    song_previewUrl: string | null;

    comment: string;

    isExpanded: boolean;
    onClickEvent: (post_id: string) => void;
}

const FADE_MS = 350;
const FALLBACK_DURATION = 30;

export default function HomePostCard({
    post_id, nickname, username, user_pfp,
    song_title, song_artist, song_albumImage, 
    song_spotifyUrl, song_deezerUrl, song_appleMusicUrl, song_previewUrl,
    comment, isExpanded, onClickEvent
}: PostCardProps) {
    const { isMuted } = useAudioSettings();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeFrameRef = useRef<number | null>(null);
    const [progress, setProgress] = useState(0);

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
            audio.play().catch(() => {});
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

    // Estilos base para os links
    const linkBaseClass = "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 z-30";

    return (
        <div id={`${post_id}`} className="py-1 px-5" style={{ containerType: 'inline-size' }}>
            <div
                className="relative flex flex-col w-full aspect-square rounded-2xl shadow-sm overflow-hidden min-h-[5rem] transition-all duration-500 ease-in-out shadow-background-dark origin-top"
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
                            src={user_pfp ? user_pfp : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
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

                    <div className="mt-auto flex justify-end items-center gap-3 w-full pb-2">
                        {/* Spotify */}
                        <a 
                            href={song_spotifyUrl || '#'}
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => { e.stopPropagation(); if(!song_spotifyUrl) e.preventDefault(); }}
                            title="Ouvir no Spotify"
                            className={`${linkBaseClass} bg-gray-700/50 ${song_spotifyUrl ? 'text-white hover:shadow-md' : 'text-gray-500 opacity-40 cursor-not-allowed pointer-events-none'}`}
                        >
                            <svg className="w-5 h-5 fill-current hover:text-[#1DB954]" viewBox="0 0 24 24">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                        </a>

                        {/* iTunes */}
                        <a 
                            href={song_appleMusicUrl || '#'}
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => { e.stopPropagation(); if(!song_appleMusicUrl) e.preventDefault(); }}
                            title="Ouvir no Apple Music"
                            className={`${linkBaseClass} bg-gray-700/50 ${song_appleMusicUrl ? 'text-white hover:shadow-md' : 'text-gray-500 opacity-40 cursor-not-allowed pointer-events-none'}`}
                        >
                            <svg className="w-5 h-5 fill-current hover:text-[#EC4DBB]" viewBox="0 0 24 24">
                                <path d="M11.977 23.999c-2.483 0-4.898-.777-6.954-2.262a11.928 11.928 0 01-4.814-7.806A11.954 11.954 0 012.3 4.994 11.85 11.85 0 0110.08.159a11.831 11.831 0 018.896 2.104 11.933 11.933 0 014.815 7.807 11.958 11.958 0 01-2.091 8.937 11.855 11.855 0 01-7.78 4.835 12.17 12.17 0 01-1.943.157zm-6.474-2.926a11.022 11.022 0 008.284 1.96 11.044 11.044 0 007.246-4.504c3.583-5.003 2.445-12.003-2.538-15.603a11.022 11.022 0 00-8.284-1.96A11.046 11.046 0 002.966 5.47C-.618 10.474.521 17.473 5.503 21.073zm10.606-3.552a2.08 2.08 0 001.458-1.468l.062-.216.008-5.786c.006-4.334 0-5.814-.024-5.895a.535.535 0 00-.118-.214.514.514 0 00-.276-.073c-.073 0-.325.035-.56.078-1.041.19-7.176 1.411-7.281 1.45a.786.786 0 00-.399.354l-.065.128s-.031 9.07-.078 9.172a.7.7 0 01-.376.35 9.425 9.425 0 01-.609.137c-1.231.245-1.688.421-2.075.801-.22.216-.382.51-.453.82-.067.294-.045.736.051 1.005.1.281.262.521.473.71.192.148.419.258.674.324.563.144 1.618-.016 2.158-.328a2.36 2.36 0 00.667-.629c.06-.089.15-.268.2-.399.176-.456.181-8.581.204-8.683a.44.44 0 01.32-.344c.147-.04 6.055-1.207 6.222-1.23.146-.02.284.027.36.12a.29.29 0 01.109.096c.048.07.051.213.058 2.785.008 2.96.012 2.892-.149 3.079-.117.136-.263.189-.864.31-.914.188-1.226.276-1.576.447-.437.213-.679.446-.867.835a1.58 1.58 0 00-.182.754c.001.49.169.871.55 1.245.035.034.069.066.104.097.192.148.387.238.633.294.37.082 1.124.025 1.641-.126z"/>
                            </svg>
                        </a>

                        {/* Deezer */}
                        <a 
                            href={song_deezerUrl || '#'}
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => { e.stopPropagation(); if(!song_deezerUrl) e.preventDefault(); }}
                            title="Ouvir no Deezer"
                            className={`${linkBaseClass} bg-gray-700/50 ${song_deezerUrl ? 'text-white hover:shadow-md' : 'text-gray-500 opacity-40 cursor-not-allowed pointer-events-none'}`}
                        >
                            <svg className="w-5 h-5 fill-current hover:text-[#a238ff]" viewBox="0 0 24 24">
                                <path d="M.693 10.024c.381 0 .693-1.256.693-2.807 0-1.55-.312-2.807-.693-2.807C.312 4.41 0 5.666 0 7.217s.312 2.808.693 2.808ZM21.038 1.56c-.364 0-.684.805-.91 2.096C19.765 1.446 19.184 0 18.526 0c-.78 0-1.464 2.036-1.784 5-.312-2.158-.788-3.536-1.325-3.536-.745 0-1.386 2.704-1.62 6.472-.442-1.932-1.083-3.145-1.793-3.145s-1.35 1.213-1.793 3.145c-.242-3.76-.874-6.463-1.628-6.463-.537 0-1.013 1.378-1.325 3.535C6.938 2.036 6.262 0 5.474 0c-.658 0-1.247 1.447-1.602 3.665-.217-1.291-.546-2.105-.91-2.105-.675 0-1.221 2.807-1.221 6.272 0 3.466.546 6.273 1.221 6.273.277 0 .537-.476.736-1.273.32 2.928.996 4.938 1.776 4.938.606 0 1.143-1.204 1.507-3.11.251 3.622.875 6.195 1.602 6.195.46 0 .875-1.023 1.187-2.677C10.142 21.6 11 24 12.004 24c1.005 0 1.863-2.4 2.235-5.822.312 1.654.727 2.677 1.186 2.677.728 0 1.352-2.573 1.603-6.195.364 1.906.9 3.11 1.507 3.11.78 0 1.455-2.01 1.775-4.938.208.797.46 1.273.737 1.273.675 0 1.22-2.807 1.22-6.273-.008-3.457-.553-6.272-1.23-6.272ZM23.307 10.024c.381 0 .693-1.256.693-2.807 0-1.55-.312-2.807-.693-2.807-.381 0-.693 1.256-.693 2.807s.312 2.808.693 2.808Z"/>
                            </svg>
                        </a>
                    </div>
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