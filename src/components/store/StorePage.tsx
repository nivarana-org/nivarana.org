"use client";

import { motion } from "motion/react";
import { PosterImageSlider } from "./PosterImageSlider";
import type { StoreData } from "@/types/store";

interface StorePageProps {
    store: StoreData;
}

export function StorePage({ store }: StorePageProps) {
    if (!store.enabled || store.posters.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-24 text-center">
                <h1 className="text-3xl font-bold text-nivarana-charcoal mb-4">
                    Nivarana Store
                </h1>
                <p className="text-gray-600">
                    Our store is launching soon. Stay tuned.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold text-nivarana-charcoal mb-4">
                    Nivarana Store
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Art and essays you can hold. Each poster is printed on
                    premium matte paper — perfect for your wall, your desk, or
                    as a gift.
                </p>
            </motion.div>

            <div className="space-y-10">
                {store.posters.map((poster, index) => (
                    <motion.article
                        key={poster.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group rounded-lg shadow-md bg-white overflow-hidden grid grid-cols-1 md:grid-cols-2"
                    >
                        <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[420px] overflow-hidden">
                            <PosterImageSlider
                                images={poster.imagePaths}
                                alt={poster.title}
                            />
                        </div>

                        <div className="p-6 md:p-8 flex flex-col">
                            <h2 className="text-2xl font-semibold text-nivarana-charcoal mb-3">
                                {poster.title}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {poster.description}
                            </p>

                            <p className="text-sm text-gray-500 mb-6">
                                Available in:{" "}
                                <span className="font-medium text-nivarana-charcoal">
                                    {poster.sizes.join(" · ")}
                                </span>
                            </p>

                            <div className="mt-auto">
                                {store.razorpayUrl ? (
                                    <a
                                        href={store.razorpayUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-3 px-6 bg-nivarana-blue text-white text-center font-semibold rounded-lg hover:bg-nivarana-blue/90 transition-colors"
                                    >
                                        Buy Now
                                    </a>
                                ) : (
                                    <span className="block w-full py-3 px-6 bg-gray-200 text-gray-500 text-center font-semibold rounded-lg">
                                        Buy Now
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}
