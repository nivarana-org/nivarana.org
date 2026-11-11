import Header from "./_components/header/Header";
import Footer from "./_components/footer/Footer";
import Script from "next/script";
import Banner from "./_components/banner/Banner";

/*
    The header is session-aware (it greets active subscribers by name), so
    every page in this group renders per request instead of statically.
*/
export const dynamic = "force-dynamic";

export default async function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <Banner />
            {children}
            <hr />
            <Footer />
            <Script src="https://analytics.nivarana.org/js/container_PLSD2pj6.js" />
        </>
    );
}
