import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { getCategories } from "@/network/api";
import Script from "next/script";

const poppins = localFont({
    src: [
        {
            path: "./fonts/Poppins-Thin.ttf",
            weight: "100",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-ThinItalic.ttf",
            weight: "100",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-ExtraLight.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-ExtraLightItalic.ttf",
            weight: "200",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-LightItalic.ttf",
            weight: "300",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-Italic.ttf",
            weight: "400",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-MediumItalic.ttf",
            weight: "500",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-SemiBoldItalic.ttf",
            weight: "600",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-BoldItalic.ttf",
            weight: "700",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-ExtraBoldItalic.ttf",
            weight: "800",
            style: "italic",
        },
        {
            path: "./fonts/Poppins-Black.ttf",
            weight: "900",
            style: "normal",
        },
        {
            path: "./fonts/Poppins-BlackItalic.ttf",
            weight: "900",
            style: "italic",
        },
    ],
    display: "swap",
    variable: "--font-poppins",
});

export const fetchCache = "default-cache";

export const metadata: Metadata = {
    title: {
        template: "%s | Nivarana",
        default: "Page",
        absolute: "Nivarana",
    },
    description:
        "Nivarana is India's public health awareness and advocacy platform that aims to bring a change by making public health-related information and stories more understandable and accessible to the general public.",
    keywords:
        "Public health, advocacy, research, India, health information, cancer, health, health information, health policy, health programs, digital health, awareness, health poetry",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const categories = await getCategories();
    return (
        <html lang="en" className={`${poppins.variable}`}>
            <body className="font-poppins">
                <Header categories={categories} />
                {children}
                <hr />
                <Footer />
                <Script src="https://analytics.nivarana.org/js/container_PLSD2pj6.js" />
            </body>
        </html>
    );
}
