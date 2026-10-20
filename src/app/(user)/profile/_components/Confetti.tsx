"use client";

import { useEffect, useMemo, useState } from "react";

interface ConfettiProps {
    show: boolean;
    duration?: number;
    onComplete?: () => void;
}

const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
];

interface ConfettiPieceData {
    id: number;
    color: string;
    left: string;
    delay: number;
}

function generateConfettiPieces(seed: number): ConfettiPieceData[] {
    const pieces: ConfettiPieceData[] = [];
    let state = seed;
    for (let i = 0; i < 50; i++) {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        const colorIndex = state % COLORS.length;
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        const left = state % 100;
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        const delay = (state % 200) / 100;
        pieces.push({
            id: i,
            color: COLORS[colorIndex],
            left: `${left}%`,
            delay,
        });
    }
    return pieces;
}

function ConfettiPiece({
    color,
    left,
    delay,
}: {
    color: string;
    left: string;
    delay: number;
}) {
    return (
        <div
            className="confetti-piece"
            style={{
                left,
                backgroundColor: color,
                animationDelay: `${delay}s`,
            }}
        />
    );
}

export function Confetti({ show, duration = 3000, onComplete }: ConfettiProps) {
    const [mountTime] = useState(() => Date.now());
    const pieces = useMemo(
        () => generateConfettiPieces(mountTime),
        [mountTime],
    );

    useEffect(() => {
        if (show && onComplete) {
            const timer = setTimeout(() => {
                onComplete();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onComplete]);

    if (!show) return null;

    return (
        <div className="confetti-container">
            <style jsx>{`
                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                    overflow: hidden;
                }
                .confetti-piece {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    top: -10px;
                    animation: confetti-fall 3s ease-out forwards;
                }
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
            {pieces.map((piece) => (
                <ConfettiPiece
                    key={piece.id}
                    color={piece.color}
                    left={piece.left}
                    delay={piece.delay}
                />
            ))}
        </div>
    );
}
