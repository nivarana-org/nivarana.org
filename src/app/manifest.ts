import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Nivarana",
        short_name: "Nivarana",
        icons: [
            { src: "/favicon.ico", type: "image/x-icon" },
            { src: "/assets/logo-2025.png", sizes: "any", type: "image/png" },
        ],
        start_url: "/",
        theme_color: "#aeafae",
        background_color: "#aeafae",
        display: "standalone",
    };
}
