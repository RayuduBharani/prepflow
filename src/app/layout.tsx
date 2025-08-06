import { Poppins } from "next/font/google";
import "./globals.css";
import AllProviders from "@/components/AllProviders";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Basic Meta Tags */}
        <title>PrepFlow - AI Interview Preparation Platform | DSA, Coding, System Design</title>
        <meta name="description" content="PrepFlow is an AI-powered platform for coding interview preparation with curated DSA sheets, system design guides, resume checks, and interactive practice for FAANG and tech interviews." />
        <meta name="generator" content="Next.js" />
        <meta name="application-name" content="PrepFlow" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Keywords */}
        <meta name="keywords" content="Prepflow, Interview Preparation, AI Interview Platform, DSA Sheets, System Design, FAANG Interviews, Cygnuxxs, Ashok Atragadda, Coding Interview Practice, Resume Review, Technical Interviews, LeetCode Alternative, Software Engineer Jobs" />
        
        {/* Author Information */}
        <meta name="author" content="R.B.S.S Durga Prasad (Bharani)" />
        <link rel="author" href="https://www.linkedin.com/in/rayudu-bharani-satya-siva-durga-prasad/" />
        <link rel="author" href="https://www.linkedin.com/in/ashok-atragadda/" />
        <meta name="creator" content="R.B.S.S Durga Prasad (Bharani)" />
        <meta name="publisher" content="Ashok Atragadda (Cygnuxxs)" />
        
        {/* Format Detection */}
        <meta name="format-detection" content="address=no, telephone=no" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://prepflow.vercel.app" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="PrepFlow - AI Interview Preparation" />
        <meta property="og:description" content="Level up your tech interviews with PrepFlow's DSA sheets, AI mock interviews, and resume feedback." />
        <meta property="og:url" content="https://prepflow.vercel.app" />
        <meta property="og:site_name" content="PrepFlow" />
        <meta property="og:image" content="https://prepflow.vercel.app/og-image.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="PrepFlow Interview Platform Banner" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PrepFlow - Ace Your Tech Interviews" />
        <meta name="twitter:description" content="Practice DSA, system design, resume review, and more." />
        <meta name="twitter:image" content="https://prepflow.vercel.app/og-image.jpeg" />
        <meta name="twitter:creator" content="@AshyGany" />
        
        {/* Site Verification */}
        <meta name="google-site-verification" content="5t4zBjhovVUsu3rVsR2HSiuUOu6yqVbHSusUkSFdnjY" />
        
        {/* PWA/Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${poppins.className} selection:bg-primary/30 selection:text-primary-foreground/30 no-scrollbar antialiased bg-background w-screen h-lvh`}
      >
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
