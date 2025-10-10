/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['freedom.tail167e0.ts.net'],
    experimental: {
        // since we're on tailwind, inlining should be fine
        // as there's only one set of css
        // PROBLEM: Fonts aren't created in build
        // inlineCss: true,

        // to allow frequent builds on dev without worry
        turbopackFileSystemCacheForDev: true,

        turbopackUseBuiltinBabel: true,

        // let's appear fancy in chrome at least
        viewTransition: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    async redirects() {
        return [
            {
                source: "/about-us",
                destination: "/about",
                permanent: true
            },
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
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000'
            },
            {
                protocol: 'https',
                hostname: 'nivarana.org',
                port: '',
            }
        ],
        dangerouslyAllowLocalIP: true
    },
    reactCompiler: true
};

export default nextConfig;
