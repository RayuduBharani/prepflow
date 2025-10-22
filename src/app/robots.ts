import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/dsa-sheets",
          "/dsa-sheets/*",
          "/jobs",
          "/jobs/*",
          "/companies",
          "/companies/*",
          "/compiler",
          "/ats-checker",
          "/ai-speech-analyzer",
          "/privacy-policy",
          "/terms-of-service",
        ],
        disallow: [
          "/api/*",
          "/admin/*",
          "/_next/*",
          "/dashboard/*",
          "/signin",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/*", "/admin/*", "/dashboard/*"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/*", "/admin/*", "/dashboard/*"],
      },
    ],
    sitemap: "https://prepflow.vercel.app/sitemap.xml",
    host: "https://prepflow.vercel.app",
  };
}
