import PageEditPage from "@/components/admin/PageEditor";
import { getPage } from "@/data/cms";

export default async function Page(props: Props) {
    const params = await props.params;
    const pageId = Number(params.id);
    const page = await getPage(pageId);
    return <PageEditPage page={JSON.parse(JSON.stringify(page))} />;
}

type Props = {
    params: Promise<{ id: string }>;
};
