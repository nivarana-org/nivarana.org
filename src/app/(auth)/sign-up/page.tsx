import PageClient from "./page-client";

type Props = {
    searchParams: Promise<{ return?: string }>;
};

export default async function Page({ searchParams }: Props) {
    const { return: returnUrl } = await searchParams;
    return <PageClient returnUrl={returnUrl} />;
}
