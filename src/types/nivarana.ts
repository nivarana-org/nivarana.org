type Author = {
    name: string;
};

type Category = {
    name: string;
    path: string;
};

export type Post = {
    id: number;
    slug: string;
    authors: Author[];
    image: string;
    title: string;
    intro: string;
    created_at: number;
    category: Category;
    contents: string;
};
