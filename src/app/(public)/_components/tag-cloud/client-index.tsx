"use client";
import Link from "next/link";
import { Tag, TagCloud } from "react-tagcloud";

type Prop = {
    tags: {
        count: number;
        value: string;
        slug: string;
    }[];
};

type CustomTag = Tag & {
    props?: {
        slug?: string;
    };
};

export default function TagCloudClient({ tags }: Prop) {
    const tagsForCloud = tags.map(({ count, value, slug }) => ({
        count,
        value,
        props: { slug },
    }));
    return (
        <div>
            <TagCloud
                minSize={20}
                maxSize={60}
                tags={tagsForCloud}
                shuffle={true} // Set to true for random arrangement
                renderer={
                    // Optional: Custom renderer for more control over styling.
                    // This is just an example, default styling often suffices.
                    (tag: CustomTag, size, color) => (
                        <Link
                            href={`/tag/${tag.props?.slug}`}
                            key={tag.value}
                            style={{
                                fontSize: `${size}px`,
                                margin: "3px",
                                padding: "3px",
                                verticalAlign: "middle",
                                display: "inline-block",
                                color: color || "#000", // You can define a color palette
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
