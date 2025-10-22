import { Poppins } from "next/font/google";
import "./globals.css";
import AllProviders from "@/components/AllProviders";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", '600', '700', '800', '900'],
  preload : true,
});

export const metadata = {
  metadataBase: new URL("https://prepflow.vercel.app"),
  title: {
    default: "PrepFlow - AI Interview Preparation Platform | DSA, System Design & More",
    template: "%s | PrepFlow",
  },
  description:
    "PrepFlow is an AI-powered platform for coding interview preparation with curated DSA sheets, system design guides, online compiler, resume ATS checker, and interactive practice for FAANG and top tech company interviews. Master algorithms, data structures, and ace your next interview.",
  keywords: [
    "Prepflow",
    "interview preparation",
    "AI interview platform",
    "DSA sheets",
    "data structures and algorithms",
    "system design",
    "FAANG interviews",
    "coding interview practice",
    "resume ATS checker",
    "online compiler",
    "LeetCode alternative",
    "software engineer jobs",
    "tech interview prep",
    "algorithm practice",
    "coding challenges",
    "interview questions",
    "Amazon interview prep",
    "Google interview prep",
    "Microsoft interview prep",
    "Meta interview prep",
    "Apple interview prep",
    "Ashok Atragadda",
    "Cygnuxxs",
  ],
  applicationName: "PrepFlow",
  generator: "Next.js",
  authors: [
    {
      name: "R.B.S.S Durga Prasad (Bharani)",
      url: "https://www.linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad/",
    },
    {
      name: "Ashok Atragadda",
      url: "https://www.linkedin.com/in/ashok-atragadda/",
    },
  ],
  creator: "R.B.S.S Durga Prasad (Bharani)",
  publisher: "Ashok Atragadda (Cygnuxxs)",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  category: "Education",
  classification: "Interview Preparation, Education Technology, Career Development",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prepflow.vercel.app",
    siteName: "PrepFlow",
    title: "PrepFlow - Master Tech Interviews with AI-Powered Preparation",
    description:
      "Ace your FAANG and tech interviews with PrepFlow's curated DSA sheets, system design guides, online compiler, AI mock interviews, and ATS resume checker. Practice like a pro, get hired faster.",
    images: [
      {
        url: "https://prepflow.vercel.app/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "PrepFlow - AI-Powered Interview Preparation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepFlow - Ace Your Tech Interviews with AI",
    description: "Master DSA, system design, resume review, and coding challenges. Your path to FAANG starts here.",
    creator: "@AshyGany",
    site: "@AshyGany",
    images: ["https://prepflow.vercel.app/og-image.jpeg"],
  },
  alternates: {
    canonical: "https://prepflow.vercel.app",
  },
  verification: {
    google: "5t4zBjhovVUsu3rVsR2HSiuUOu6yqVbHSusUkSFdnjY",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data - Organization */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PrepFlow",
              alternateName: "PrepFlow Interview Preparation",
              url: "https://prepflow.vercel.app",
              logo: "https://prepflow.vercel.app/logos/manifest-icon-512.maskable.png",
              description: "AI-powered interview preparation platform for tech professionals",
              foundingDate: "2024",
              sameAs: [
                "https://www.linkedin.com/in/ashok-atragadda/",
                "https://twitter.com/AshyGany",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                email: "support@prepflow.vercel.app",
              },
            }),
          }}
        />

        {/* Structured Data - WebSite */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PrepFlow",
              url: "https://prepflow.vercel.app",
              description: "Master tech interviews with AI-powered preparation tools, DSA sheets, system design guides, and online compiler",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://prepflow.vercel.app/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Structured Data - Educational Organization */}
        <Script
          id="educational-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "PrepFlow",
              url: "https://prepflow.vercel.app",
              description: "Online platform for technical interview preparation",
              educationalCredentialAwarded: "Interview Preparation Skills",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "PrepFlow Learning Resources",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "DSA Problem Sheets",
                      description: "Curated data structures and algorithms practice problems",
                      provider: {
                        "@type": "Organization",
                        name: "PrepFlow",
                      },
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "System Design Guides",
                      description: "Comprehensive system design interview preparation",
                      provider: {
                        "@type": "Organization",
                        name: "PrepFlow",
                      },
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} no-scrollbar antialiased theme-container bg-background w-screen h-lvh`}
      >
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
