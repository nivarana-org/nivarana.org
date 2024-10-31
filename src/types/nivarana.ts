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