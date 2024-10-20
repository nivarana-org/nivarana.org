import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://nivarana.org',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        }
    ]
}