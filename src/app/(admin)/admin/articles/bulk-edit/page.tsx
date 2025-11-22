import { getArticlesOverview } from "@/data/cms";
import Link from "next/link";
import { PathEditor } from "./path-editor";

function LinkEditor({ a }) {
    return (
        <PathEditor id={a.id} path={a.path} title={a.page_title}></PathEditor>
    );
}

export default async function Page({}) {
    const articles = await getArticlesOverview();
    return (
        <div className="flex flex-col gap-2 p-2">
            {articles.map((a) => (
                <LinkEditor a={a} key={a.id}></LinkEditor>
            ))}
        </div>
    );
}
