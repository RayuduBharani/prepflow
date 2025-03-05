import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PrepFlow - Prepare for your interviews.",
    short_name: "PrepFlow",
    description: "An interview preparation platform with AI-powered features.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#18181b",
    orientation: "portrait",
    screenshots: [
      ...Array.from({ length: 5 }, (_, i) => ({
        src: `screenshot_${i + 1}.png`,
        type: "image/png",
        sizes: "2560x1424",
        form_factor: "wide",
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        src: `mobile_ss_${i + 1}.png`,
        type: "image/png",
        sizes: "854x1424",
      })),
    ],
    icons: [
      {
        src: "/logos/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logos/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logos/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logos/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
