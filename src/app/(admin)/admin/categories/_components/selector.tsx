"use client";

export default function Selector({
    categories,
    postId,
    setPostToCategory,
    initialSelected,
}: {
    categories: { id: number; name: string }[];
    postId: number;
    setPostToCategory: (postId: number, categoryId: number) => Promise<unknown>;
    initialSelected: number;
}) {
    return (
        <select
            name="category"
            data-post-id={postId}
            defaultValue={initialSelected}
            onChange={async (e) => {
                await setPostToCategory(postId, Number(e.target.value));
            }}
        >
            {categories.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                </option>
            ))}
        </select>
    );
}
