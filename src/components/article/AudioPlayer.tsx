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
        return <ActualAudioPlayer className="audio-player" src={src} />;
    }
    return null;
}
