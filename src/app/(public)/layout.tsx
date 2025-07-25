import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Script from "next/script";
import { getCategories } from "@/data/cms";

export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const categories = await getCategories();
    return (
        <>
            <Header categories={categories} />
            {children}
            <hr />
            <Footer />
            <Script src="https://analytics.nivarana.org/js/container_PLSD2pj6.js" />
        </>
    );
}
