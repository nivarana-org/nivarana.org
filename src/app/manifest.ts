import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Nivarana",
        short_name: "Nivarana",
        icons: [
            { src: "/favicon.ico", type: "image/x-icon" },
            { src: "/icon.png", sizes: "any", type: "image/png" },
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
        start_url: "/",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
    };
}
