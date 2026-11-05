import RelatedPosts from "./related";

type SidebarProps = {
    post: {
        id: number;
        tags: { id: number }[];
    };
};

function Sidebar({ post }: SidebarProps) {
    return (
        <div className="sidebar">
            <RelatedPosts tags={post.tags} excludePostId={post.id} />
        </div>
    );
}

export default Sidebar;
