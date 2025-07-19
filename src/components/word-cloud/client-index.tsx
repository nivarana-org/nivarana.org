"use client";
import Link from "next/link";
import { TagCloud } from "react-tagcloud";

export default function WordCloudClient({ wordCloud }) {
    return (
        <div>
            <TagCloud
                minSize={20}
                maxSize={60}
                tags={wordCloud}
                shuffle={true} // Set to true for random arrangement
                renderer={
                    // Optional: Custom renderer for more control over styling.
                    // This is just an example, default styling often suffices.
                    (tag, size, color) => (
                        <Link
                            href={{
                                pathname: "/search",
                                query: {
                                    q: tag.value,
                                },
                            }}
                            key={tag.value}
                            style={{
                                fontSize: `${size}px`,
                                margin: "3px",
                                padding: "3px",
                                verticalAlign: "middle",
                                display: "inline-block",
                                color: color || "#000", // You can define a color palette
                                opacity: tag.count / wordCloud[0].value + 0.2, // Example: opacity based on count
                            }}
                        >
                            {tag.value}
                        </Link>
                    )
                }
            />
        </div>
    );
}
