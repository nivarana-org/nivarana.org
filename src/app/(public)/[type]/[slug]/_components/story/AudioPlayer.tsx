"use client";

import { useEffect, useState } from "react";
import { AudioPlayer as ActualAudioPlayer } from "react-audio-play";

type AudioPlayerProps = {
    src: string;
};
export default function AudioPlayer({ src }: AudioPlayerProps) {
    const [srcValid, setSrcValid] = useState(false);
    useEffect(() => {
        fetch(src, { method: "HEAD" }).then((s) => {
            if (s.status === 200) {
                setSrcValid(true);
            } else {
                setSrcValid(false);
            }
        });
    }, [src]);

    if (srcValid) {
        return (
            <div className="mt-4 rounded-lg border border-nivarana-green/30 bg-nivarana-white/20 p-4">
                <div className="mb-3 text-xs font-bold uppercase tracking-wide text-nivarana-green">
                    Listen to this article
                </div>
                <ActualAudioPlayer className="audio-player" src={src} />
            </div>
        );
    }
    return null;
}
