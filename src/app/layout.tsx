import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import Loading from "./loading";
import { Toaster } from "@/components/ui/sonner";
import ThemeDataProvider from "@/components/theme-data-provider";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/Footer"));

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title:
    "PrepFlow - AI Interview Preparation Platform | DSA, Coding, System Design",
  description:
    "PrepFlow is an AI-powered platform for coding interview preparation with curated DSA sheets, system design guides, resume checks, and interactive practice for FAANG and tech interviews.",
  generator: "Next.js",
  applicationName: "PrepFlow",
  referrer: "strict-origin-when-cross-origin",
  keywords: [
    "Prepflow",
    "Interview Preparation",
    "AI Interview Platform",
    "DSA Sheets",
    "System Design",
    "FAANG Interviews",
    "Cygnuxxs",
    "Ashok Atragadda",
    "Coding Interview Practice",
    "Resume Review",
    "Technical Interviews",
    "LeetCode Alternative",
    "Software Engineer Jobs",
  ],
  authors: [
    {
      name: "R.B.S.S Durga Prasad (Bharani)",
      url: "https://www.linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad/",
    },
    {
      name: "Ashok Atragadda (Cygnuxxs)",
      url: "https://www.linkedin.com/in/ashok-atragadda/",
    },
  ],
  creator: "R.B.S.S Durga Prasad (Bharani)",
  publisher: "Ashok Atragadda (Cygnuxxs)",
  formatDetection: {
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://prepflow.vercel.app",
  },
  openGraph: {
    title: "PrepFlow - AI Interview Preparation",
    description:
      "Level up your tech interviews with PrepFlow's DSA sheets, AI mock interviews, and resume feedback.",
    url: "https://prepflow.vercel.app",
    siteName: "PrepFlow",
    images: [
      {
        url: "https://prepflow.vercel.app/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "PrepFlow Interview Platform Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepFlow - Ace Your Tech Interviews",
    description: "Practice DSA, system design, resume review, and more.",
    images: ["https://prepflow.vercel.app/og-image.jpeg"],
    creator: "@AshyGany",
  },
};
export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head key={1}>
        <meta
          name="google-site-verification"
          content="5t4zBjhovVUsu3rVsR2HSiuUOu6yqVbHSusUkSFdnjY"
        />
      </Head>
      <body
        className={`${poppins.className} selection:bg-primary/30 selection:text-primary-foreground/30 no-scrollbar antialiased bg-background w-screen h-lvh`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <ThemeDataProvider>
            <Suspense fallback={<Loading />}>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </Suspense>
          </ThemeDataProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
