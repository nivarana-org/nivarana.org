import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
    subsets: ["devanagari", "latin"],
    // thin = 100, extralight = 200, light = 300,
    // normal = 400, medium = 500, semibold = 600,
    // bold = 700, extrabold = 800, black = 900
    weight: ["400", "500", "600", "700"],
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
    return (
        <html lang="en" className={`${poppins.variable}`}>
            <body className="font-body">{children}</body>
        </html>
    );
}
