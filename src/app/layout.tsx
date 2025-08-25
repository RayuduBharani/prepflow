import { Poppins } from "next/font/google";
import "./globals.css";
import AllProviders from "@/components/AllProviders";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL("https://prepflow.vercel.app"),
  title: {
    default: "PrepFlow - AI Interview Preparation Platform",
    template: "%s | PrepFlow",
  },
  description:
    "PrepFlow is an AI-powered platform for coding interview preparation with curated DSA sheets, system design guides, resume checks, and interactive practice for FAANG and tech interviews.",
  keywords: [
    "Prepflow",
    "Interview Preparation",
    "AI Interview Platform",
    "DSA Sheets",
    "System Design",
    "FAANG Interviews",
    "Ashok Atragadda",
    "Coding Interview Practice",
    "Resume Review",
    "LeetCode Alternative",
    "Software Engineer Jobs",
  ],
  applicationName: "PrepFlow",
  generator: "Next.js",
  authors: [
    { name: "R.B.S.S Durga Prasad (Bharani)", url: "https://www.linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad/" },
    { name: "Ashok Atragadda", url: "https://www.linkedin.com/in/ashok-atragadda/" },
  ],
  creator: "R.B.S.S Durga Prasad (Bharani)",
  publisher: "Ashok Atragadda (Cygnuxxs)",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prepflow.vercel.app",
    siteName: "PrepFlow",
    title: "PrepFlow - AI Interview Preparation",
    description:
      "Level up your tech interviews with PrepFlow's DSA sheets, AI mock interviews, and resume feedback.",
    images: [
      {
        url: "https://prepflow.vercel.app/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "PrepFlow Interview Platform Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepFlow - Ace Your Tech Interviews",
    description:
      "Practice DSA, system design, resume review, and more.",
    creator: "@AshyGany",
    images: ["https://prepflow.vercel.app/og-image.jpeg"],
  },
  alternates: {
    canonical: "https://prepflow.vercel.app",
  },
  verification: {
    google: "5t4zBjhovVUsu3rVsR2HSiuUOu6yqVbHSusUkSFdnjY",
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
        <Script id="prepflow"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PrepFlow",
              url: "https://prepflow.vercel.app",
              logo: "https://prepflow.vercel.app/logo.png", // <-- put your real logo URL here
              sameAs: [
                "https://www.linkedin.com/in/ashok-atragadda/",
                "https://x.com/AshyGany",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${poppins.className} selection:bg-primary/30 selection:text-primary-foreground/30 no-scrollbar antialiased bg-background w-screen h-lvh`}
      >
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
