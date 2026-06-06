import { getArticlesPaginated } from "@/data/cms";
import { getImageURLFromFileName } from "@/utils/paths";
import { Feed } from "feed";

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
        const categorySlug = post.category[0].path;
        const url = `https://nivarana.org/${categorySlug}/${post.path}`;
        const imageUrl = getImageURLFromFileName(post.upload_image);
        const optimizedImageUrl = `https://nivarana.org/_next/image?url=${encodeURIComponent(imageUrl)}&w=1200&q=75`;
        const authors = post.authors.map((a) => ({
            name: a.name,
            email: a.email,
            link: `https://nivarana.org/author/${a.path}`,
        }));
        feed.addItem({
            title: post.page_title,
            id: url,
            link: url,
            description: post.meta_description,
            content: post.content,
            author: authors,
            contributor: authors,
            date: post.published_time,
            image: optimizedImageUrl,
            category: post.category[0].name,
        });
    });
    return feed;
};
