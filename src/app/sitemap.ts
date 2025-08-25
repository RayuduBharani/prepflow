import type { MetadataRoute } from "next";
export default function sitemap() : MetadataRoute.Sitemap {
  return [
    {
      url : 'https://prepflow.vercel.app',
      lastModified : new Date(),
      changeFrequency : 'yearly',
      priority : 1.0
    },
    {
      url : 'https://prepflow.vercel.app/jobs',
      lastModified : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://prepflow.vercel.app/dsa-sheets',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url : 'https://prepflow.vercel.app/companies',
      lastModified : new Date(),
      changeFrequency : 'yearly',
      priority : 0.9,
    },
    {
      url : 'https://prepflow.vercel.app/compiler',
      lastModified : new Date(),
      changeFrequency : 'never',
      priority : 0.9,
    }
  ]
}