import { sql } from "kysely";
import { db } from "./db";

type Author = {
    id: number;
    name: string;
    email: string;
    path: string;
    bio: string;
};

const authorsFragment = sql<Author>`COALESCE(
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', a.id,
                'name', a.name,
                'email', a.email,
                'path', a.path,
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
    path: string;
};

const categoriesFragment = sql<Category>`COALESCE(
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', c.id,
                'name', c.name,
                'path', c.path
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
    path: string;
};

const tagsFragment = sql<Tag>`COALESCE(
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', c.id,
                'name', c.name,
                'path', c.path
            ) ORDER BY tr.order ASC
        )
        FROM post_relations tr
        JOIN categories c ON tr.relation_id = c.id
        WHERE tr.post_id = b.id
            AND tr.relation_type = 'tag'
    ), JSON_ARRAY()
)`;

const articleData = sql`
    b.id,
    b.page_title as title,
    b.upload_image as image,
    b.path as path,
    b.meta_description as intro,
    b.description as content,
    b.created_at as created_at,
    b.scheduled_time as scheduled_time,
    b.total_views as total_views,
    b.type as type
`;

const articleJSONData = sql`
    'id', b.id,
    'path', b.path,
    'title', b.page_title,
    'image', b.upload_image,
    'intro', b.meta_description
`;

type Post = {
    id: number;
    title: string;
    image: string;
    path: string;
    intro: string;
    content: string;
    created_at: Date;
    scheduled_time: Date;
    total_views: number;
    type: "article" | "photo-essay";
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
    | "path"
    | "intro"
    | "authors"
    | "categories"
    | "tags"
>;

export const getPost = async ({
    id,
    slug,
}: {
    id: number | undefined;
    slug: string | undefined;
}) => {
    const idFrag = sql`b.id = ${id}`;
    const slugFrag = sql`b.path = ${slug}`;
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
    path: string;
    articles: PostPreview[];
};

export const getOverview = async () => {
    const result = await sql<CategoryOverview>`SELECT
        c.id,
        c.name,
        c.path,
        COALESCE(
            (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        ${articleJSONData},
                        'authors', ${authorsFragment},
                        'tags', ${tagsFragment},
                        'categories', ${categoriesFragment}
                    ) ORDER BY b.id DESC LIMIT 5
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
        SELECT MAX(b2.scheduled_time)
        FROM blogs b2
        JOIN post_relations pr2 ON b2.id = pr2.post_id
        WHERE pr2.relation_type = 'category'
            AND pr2.relation_id = c.id
            AND b2.status = 'PUBLISHED'
    ) DESC
    ;`.execute(db);
    return result.rows;
};
