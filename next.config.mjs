/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async redirects() {
        return [
            {
                source: "/singleBlogDetails/:slug",
                destination: "/article/:slug",
                permanent: true
            },
            {
                source: "/authorDetails/:slug",
                destination: "/author/:slug",
                permanent: true
            },
            {
                source: "/staticPage/contact-us",
                destination: "/contact",
                permanent: false
            },
            {
                source: "/staticPage/about-us",
                destination: "/about",
                permanent: false
            },
            {
                source: "/staticPage/submission-guidelines",
                destination: "/submission-guidelines",
                permanent: false
            },
        ]
    },
    serverExternalPackages: ['knex'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'blogsadmin.nivarana.org',
                port: '',
            }
        ]
    }
};

export default nextConfig;
