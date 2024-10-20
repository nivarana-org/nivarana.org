import Link from "next/link";

function Breadcrumbs({ category, page_title }: { category: { path: string, name: string }, page_title: string }) {
    const showTitle = false;
    return (<nav aria-label="breadcrumb" className="p-2">
        <ol className="flex space-x-2 text-sm text-gray-500">
            <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                    Home
                </Link>
            </li>
            <li>
                <span>/</span>
            </li>
            <li>
                <Link
                    href={'/category/' + category.path}
                    className="text-gray-500 hover:text-gray-700"
                >
                    {category.name}
                </Link>
            </li>
            {showTitle ? <>
                <li>
                    <span>/</span>
                </li>
                <li aria-current="page" className="text-gray-700">
                    {page_title}
                </li>
            </> : null}

        </ol>
    </nav>)
}
export default Breadcrumbs;