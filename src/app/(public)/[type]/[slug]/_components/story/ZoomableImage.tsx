"use client";

import React, { useState, type ReactNode } from "react";
import Image from "next/image";

// https://medium.com/@thomasaugot/adding-zoom-functionality-to-an-image-viewer-in-react-next-js-4621be8eb770
const ZoomableImage = ({
    src,
    alt = "",
    credit,
}: {
    src: string;
    alt?: string;
    credit?: ReactNode;
}) => {
    const [zoomedImage, setZoomedImage] = useState(false);
    return (
        <>
            <div className="relative">
                <div onClick={() => setZoomedImage(true)}>
                    <Image
                        src={src}
                        alt={
                            alt ||
                            "Sorry, we are in the process of creating alt"
                        }
                        width={1280}
                        height={900}
                        className="inset-0 w-full md:w-auto mx-auto object-cover"
                    />
                </div>
                {credit}
            </div>
            {zoomedImage && (
                <div
                    className="zoomed-image-container"
                    onClick={() => setZoomedImage(false)}
                >
                    <Image
                        src={src}
                        alt={alt || "Zoomed image, again no alt"}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            )}
        </>
    );
};

export default ZoomableImage;
