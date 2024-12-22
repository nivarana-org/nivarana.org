type Author = {
    name: string
}

type Category = {
    name: string
    path: string
}

export type Post = {
    path: string
    authors_data: Author[]
    author?: Author
    upload_image: string
    page_title: string
    meta_description: string
    created_at: string
    category: Category
}

export type OldBackendPost = {
    total_views: number
    id: number
    page_title: string
    category_name: string
    authors: string[]
    description: string
    upload_image: string
    image_text: string
    meta_title: string
    meta_keyword: string
    meta_description: string
    path: string
    created_at: string
    updated_at: string
    authors_data: {
        id: number
        author_name: string
        author_views: number
        first_peragraph: string
        description: string
        path: string
    }[]
    category: {
        id: number
        name: string
        parent_id: number
        meta_title: string
        meta_description: string
        path: string
    }
}