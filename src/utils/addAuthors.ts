import { Article, Author } from "@/data/cms";

export const addAuthors = (articles: Article[], authors: Author[]) => {
    const initial: { [index: number]: Author } = {};
    const authorsById = authors.reduce((agg, curr) => {
        agg[curr.id] = curr;
        return agg;
    }, initial);
    const enhancedArticles = articles.map((post) => {
        const authors_data = post?.authors
            ?.split(",")
            ?.map((author) => authorsById[Number(author)]);
        return { ...post, authors_data };
    });
    return enhancedArticles;
};
