import { sql } from "kysely";
import { db } from "./db";
import type { PostLayout, Story } from "./story";

type Author = {
    id: number;
    name: string;
    email: string;
    slug: string;
    bio: string;
};

export const authorsFragment = sql<Author[]>`COALESCE(
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', a.id,
                'name', a.name,
                'email', a.email,
                'slug', a.slug,
                'bio', a.description
            ) ORDER BY ar.order ASC
        )
        FROM post_relations ar
        JOIN authors a ON ar.relation_id = a.id
        WHERE ar.post_id = b.id
            AND ar.relation_type = 'author'
    ), JSON_ARRAY()
)`;

type Category = {
    id: number;
    name: string;
    slug: string;
};

export const categoriesFragment = sql<Category[]>`COALESCE(
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', c.id,
                'name', c.name,
                'slug', c.slug
            )
        )
        FROM post_relations cr
        JOIN categories c ON cr.relation_id = c.id
        WHERE cr.post_id = b.id
            AND cr.relation_type = 'category'
    ), JSON_ARRAY()
)`;

type Tag = {
    id: number;
    name: string;
    slug: string;
};

export const tagsFragment = sql<Tag[]>`COALESCE(
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', t.id,
                'name', t.name,
                'slug', t.slug
            ) ORDER BY tr.order ASC
        )
        FROM post_relations tr
        JOIN tags t ON tr.relation_id = t.id
        WHERE tr.post_id = b.id
            AND tr.relation_type = 'tag'
    ), JSON_ARRAY()
)`;

const articleData = sql`
    b.id,
    b.title,
    b.image,
    b.slug,
    b.intro,
    b.contents,
    b.created_at,
    b.published_at,
    b.views,
    b.layout
`;

const articleJSONData = sql`
    'id', b.id,
    'slug', b.slug,
    'title', b.title,
    'image', b.image,
    'intro', b.intro
`;

type Post = {
    id: number;
    title: string;
    image: string;
    slug: string;
    intro: string;
    /**
     * The story document. Kysely's `ParseJSONResultsPlugin` hands us an object
     * whenever the stored value looks like JSON, so this is either the parsed
     * document or the raw JSON string — use `parseStory` to read it.
     */
    contents: string | Story;
    created_at: Date;
    published_at: Date;
    views: number;
    layout: PostLayout;
    categories: Category[];
    tags: Tag[];
    authors: Author[];
    comments_count: number;
};

type PostPreview = Pick<
    Post,
    | "id"
    | "title"
    | "image"
    | "slug"
    | "intro"
    | "authors"
    | "categories"
    | "tags"
>;

export const getPost = async ({ id, slug }: { id?: number; slug?: string }) => {
    const idFrag = sql`b.id = ${id}`;
    const slugFrag = sql`b.slug = ${slug}`;
    const selectorFrag = id ? idFrag : slugFrag;
    const result = await sql<Post>`SELECT
        ${articleData},
        (
            SELECT COUNT(*)
            FROM comments bc
            WHERE bc.blog_id = b.id
                AND bc.status = 'accepted'
        ) as comments_count,
        ${authorsFragment} as authors,
        ${tagsFragment} as tags,
        ${categoriesFragment} as categories
        FROM blogs b
        WHERE ${selectorFrag}
          AND b.status = 'PUBLISHED'
    ;`.execute(db);
    return result.rows[0];
};

type CategoryOverview = {
    id: number;
    name: string;
    slug: string;
    articles: PostPreview[];
};

export const getOverview = () => getCategoriesWithArticles(true, 5);

type PostBasics = Pick<Post, "id" | "title" | "image" | "slug" | "intro">;

type CategoryWithArticleTitles = {
    id: number;
    name: string;
    slug: string;
    articles: PostBasics[];
};

function getCategoriesWithArticles(
    withRelations: true,
    limit?: number,
): Promise<CategoryOverview>;
function getCategoriesWithArticles(
    withRelations: false,
    limit?: number,
): Promise<CategoryWithArticleTitles>;
async function getCategoriesWithArticles(
    withRelations: boolean,
    limit?: number,
) {
    const articleObjectFields = withRelations
        ? sql`
                ${articleJSONData},
                'authors', ${authorsFragment},
                'tags', ${tagsFragment},
                'categories', ${categoriesFragment}
            `
        : articleJSONData;
    const limitClause = limit ? sql` LIMIT ${limit}` : sql``;
    const result = await sql<CategoryOverview>`SELECT
        c.id,
        c.name,
        c.slug,
        COALESCE(
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        ${articleObjectFields}
                    ) ORDER BY b.id DESC${limitClause}
                )
                FROM blogs b
                WHERE b.id IN (
                    SELECT pr.post_id
                    FROM post_relations pr
                    WHERE pr.relation_type = 'category'
                        AND pr.relation_id = c.id
                ) AND b.status = 'PUBLISHED'
            ), JSON_ARRAY()
        ) AS articles
    FROM categories c
    WHERE c.parent_id = 0
    ORDER BY (
        SELECT MAX(b2.published_at)
        FROM blogs b2
        JOIN post_relations pr2 ON b2.id = pr2.post_id
        WHERE pr2.relation_type = 'category'
            AND pr2.relation_id = c.id
            AND b2.status = 'PUBLISHED'
    ) DESC
    ;`.execute(db);
    return result.rows;
}

export const getCategoriesWithArticleLinks = () =>
    getCategoriesWithArticles(false);

export const getArticleBySlug = (slug: string) => getPost({ slug });

export const getArticlesByRelation = (
    relationType: "author" | "category" | "tag",
    relationId: number,
) =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.title",
            "b.slug",
            "b.contents",
            "b.image",
            "b.intro",
            "b.created_at",
            "b.updated_at",
            "b.layout",
            "b.status",
            "b.published_at",
            "b.language",
            "b.views",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .where(({ exists, selectFrom }) =>
            exists(
                selectFrom("post_relations as pr")
                    .select("pr.post_id")
                    .whereRef("pr.post_id", "=", "b.id")
                    .where("pr.relation_type", "=", relationType)
                    .where("pr.relation_id", "=", relationId),
            ),
        )
        .orderBy("b.created_at", "desc")
        .execute();
