import { getRedirect, searchArticles } from "@/data/cms";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{ catch: string[] }>;
};

export default async function Page(props: Props) {
    const { catch: input } = await props.params;

    if (!validArray(input)) {
        return notFound();
    }

    const oldPath: [string, ...string[]] = input;
    const fullPath = `/${oldPath.join("/")}/`;
    const lastSegment: string = oldPath.at(-1)!;

    for (const path of [fullPath, lastSegment]) {
        const redirectResult = await getRedirect(path);
        if (redirectResult && redirectResult.destination) {
            return redirect(redirectResult.destination);
        }
    }

    const searchResult = await searchArticles(
        oldPath.join(" ").split("-").join(" "),
    );
    if (searchResult.length > 0) {
        const slug = searchResult[0].path;
        const category = searchResult[0].category;
        return redirect(`/${category.name}/${slug}`, "replace");
    }
}

function validArray(input: string[] | string): input is [string, ...string[]] {
    return Array.isArray(input) && input.length > 0;
}
