import { getArticlesPaginated } from "../queries";
import { getImageURLFromFileName } from "@/utils/paths";
import { parseStory } from "@/data/story";
import { Feed } from "feed";

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            case '"':
                return "&quot;";
        }
    });
}

/**
 * The feed body of a story is the concatenation of its chapters. A story with
 * a single chapter — a plain article — reads exactly like its body.
 */
const getContent = (post) => {
    return parseStory(post.contents)
        .chapters.map((chapter) => {
            const heading = chapter.title
                ? `<h2>${chapter.title}</h2>\n<hr>`
                : "";
            return `${heading}${chapter.body}`;
        })
        .join("\n<br/>\n");
};

export const getFeed = async () => {
    const feed = new Feed({
        title: "Nivarana",
        description: "India's Public Health Platform",
        id: "https://nivarana.org/",
        link: "https://nivarana.org/",
        language: "en",
        image: "https://nivarana.org/assets/logo-2025-square.png",
        favicon: "https://nivarana.org/favicon.ico",
        feedLinks: {
            json: "https://nivarana.org/feed/feed.json",
            atom: "https://nivarana.org/feed/atom.xml",
            rss: "https://nivarana.org/feed/rss.xml",
        },
    });
    const posts = await getArticlesPaginated(0, 20);
    posts.forEach((post) => {
        const categorySlug = post.category[0].slug;
        const url = `https://nivarana.org/${categorySlug}/${post.slug}`;
        const imageUrl = getImageURLFromFileName(post.image);
        const optimizedImageUrl = escapeXml(
            `https://nivarana.org/_next/image?url=${encodeURIComponent(imageUrl)}&w=1200&q=75`,
        );
        const authors = post.authors.map((a) => ({
            name: a.name,
            email: a.email,
            link: `https://nivarana.org/author/${a.slug}`,
        }));
        feed.addItem({
            title: post.title,
            id: url,
            link: url,
            description: post.intro,
            content: getContent(post),
            author: authors,
            contributor: authors,
            date: post.published_time,
            image: optimizedImageUrl,
            category: post.category[0].name,
        });
    });
    return feed;
};
