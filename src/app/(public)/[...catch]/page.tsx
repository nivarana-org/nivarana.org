import { getRedirect, searchArticles } from "@/data/cms";
import { denormalizeAsOldSlugs } from "@/utils/normalizers";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{ catch: string[] }>;
};

export default async function Page(props: Props) {
    const params = await props.params;
    if (Array.isArray(params.catch) && params.catch.length > 0) {
        const paths = [`/${params.catch.join("/")}/`, params.catch.at(-1)];
        for (const path of paths) {
            const result = await getRedirect(path);
            if (result && result.destination) {
                return redirect(result.destination);
            }
        }

        const searchResult = await searchArticles(params.catch.join(" "));
        if (searchResult.length > 0) {
            const slug = denormalizeAsOldSlugs(searchResult[0].path);
            // const slug = searchResult[0].path;
            const category = searchResult[0].category;
            return redirect(`/${category.name}/${slug}`, "replace");
        }
    }
    return notFound();
}
