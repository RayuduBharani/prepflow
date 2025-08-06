import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ['/', '/jobs', '/dsa-sheets', '/companies', '/compiler'],
        disallow: ["/api", "/admin", "/private"]
      }
    ],
    sitemap: "https://prepflow.vercel.app/sitemap.xml",
    host: "https://prepflow.vercel.app"
  };
}
