"use client";

import { useState } from "react";
import Image from "next/image";

interface PosterImageSliderProps {
    images: string[];
    alt: string;
    className?: string;
}

export function PosterImageSlider({
    images,
    alt,
    className = "",
}: PosterImageSliderProps) {
    const [index, setIndex] = useState(0);

    if (images.length === 0) return null;

    const paginate = (newDirection: number) => {
        setIndex(
            (current) =>
                (current + newDirection + images.length) % images.length,
        );
    };

    const showControls = images.length > 1;

    return (
        <div
            className={`relative h-full w-full overflow-hidden group ${className}`}
        >
            <div
                className="flex h-full transition-transform duration-[400ms] ease-in-out motion-reduce:transition-none"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {images.map((image, i) => (
                    <div
                        key={`${image}-${i}`}
                        className="relative h-full w-full shrink-0"
                    >
                        <Image
                            src={image}
                            alt={`${alt} — photo ${i + 1}`}
                            fill
                            className="object-contain transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                ))}
            </div>

            {showControls && (
                <>
                    <button
                        onClick={() => paginate(-1)}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-opacity duration-200 cursor-pointer z-10"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-opacity duration-200 cursor-pointer z-10"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                aria-label={`Go to photo ${i + 1}`}
                                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                                    i === index
                                        ? "w-5 bg-white"
                                        : "w-2 bg-white/50 hover:bg-white/80"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
