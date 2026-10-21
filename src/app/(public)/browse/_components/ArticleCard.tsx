"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ArticleCardProps {
    slug: string;
    category: string;
    title: string;
    imageUrl: string;
}

export function ArticleCard({
    slug,
    category,
    title,
    imageUrl,
}: ArticleCardProps) {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();
    const href = `/${category}/${slug}`;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isActive) {
            router.push(href);
        } else {
            setIsActive(true);
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            className="relative aspect-3/2 group"
        >
            <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div
                className={`absolute inset-0 bg-linear-to-b from-black/0 via-black/20 to-black/80 transition-opacity duration-300 flex items-end
          ${isActive ? "opacity-70" : "opacity-0"}
          @media(hover: hover):group-hover:opacity-100`}
            >
                <h3 className="text-white p-4 text-base font-medium line-clamp-2">
                    {title}
                </h3>
            </div>
        </a>
    );
}
