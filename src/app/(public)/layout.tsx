import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins, Work_Sans } from 'next/font/google';

import "./globals.css";
import Header from "@/components/header/Header"
import Footer from "@/components/footer/Footer"
import { getCategories } from "@/network/api";
import Script from "next/script";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

// Work Sans
const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

export const fetchCache = 'default-cache'

export const metadata: Metadata = {
  title: {
    template: '%s | Nivarana',
    default: 'Page',
    absolute: 'Nivarana'
  },
  description: "Nivarana is India's public health awareness and advocacy platform that aims to bring a change by making public health-related information and stories more understandable and accessible to the general public.",
  keywords: "Public health, advocacy, research, India, health information, cancer, health, health information, health policy, health programs, digital health, awareness, health poetry"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories()
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header categories={categories}/>
        {children}
        <hr/>
        <Footer/>
        <Script src="https://analytics.nivarana.org/js/container_PLSD2pj6.js"/>
      </body>
    </html>
  );
}
