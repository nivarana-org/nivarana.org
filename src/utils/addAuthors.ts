export const addAuthors = (articles, authors) => {
    const authorsById = authors.reduce((agg, curr) => {
        agg[curr.id] = curr;
        return agg;
    }, {});
    return articles.map((post) => {
        const authors_data = post?.authors
            ?.split(",")
            ?.map((author) => authorsById[author]);
        post.authors_data = authors_data;
        return post;
    });
};
