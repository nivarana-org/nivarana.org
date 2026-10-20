"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

interface PosterImageSliderProps {
    images: string[];
    alt: string;
    className?: string;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
    }),
    center: { x: 0 },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
    }),
};

export function PosterImageSlider({
    images,
    alt,
    className = "",
}: PosterImageSliderProps) {
    const [[index, direction], setIndex] = useState([0, 0]);

    if (images.length === 0) return null;

    const paginate = (newDirection: number) => {
        setIndex(([current]) => [
            (current + newDirection + images.length) % images.length,
            newDirection,
        ]);
    };

    const goTo = (target: number) => {
        setIndex(([current]) => [
            target,
            target > current ? 1 : target < current ? -1 : 0,
        ]);
    };

    const showControls = images.length > 1;

    return (
        <div
            className={`relative h-full w-full overflow-hidden group ${className}`}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[index]}
                        alt={`${alt} — photo ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </motion.div>
            </AnimatePresence>

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
                                onClick={() => goTo(i)}
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
