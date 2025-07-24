import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Nivarana — India's Public Health Platform",
        short_name: "Nivarana",
        icons: [
            {
                src: "/assets/logo-2025-square.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/assets/logo-2025-square-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
        ],
        id: "/",
        start_url: "/",
        theme_color: "#aeafae",
        background_color: "#aeafae",
        display: "standalone",
    };
}
