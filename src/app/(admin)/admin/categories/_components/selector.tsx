"use client";

export default function Selector({
    categories,
    postId,
    setPostToCategory,
    initialSelected,
}) {
    return (
        <select
            name="category"
            data-post-id={postId}
            defaultValue={initialSelected}
            onChange={async (e) => {
                await setPostToCategory(
                    e.target.dataset.postId,
                    e.target.value,
                );
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
