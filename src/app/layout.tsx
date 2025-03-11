import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";
import Loading from "./loading";
import { Toaster } from "@/components/ui/sonner";
import ThemeDataProvider from "@/components/theme-data-provider";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import('@/components/Footer'))
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PrepFlow",
  description: "An Interview Preparation Platform with AI-powered features.",
  generator: "Next.js",
  applicationName: "PrepFlow",
  referrer: "strict-origin-when-cross-origin",
  keywords: [
    "Prepflow",
    "DSA",
    "DSA sheet",
    "DSA sheets",
    "Interview Preparation",
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
  creator : 'R.B.S.S Durga Prasad (Bharani)',
  publisher : 'Ashok Atragadda (Cygnuxxs)',
  formatDetection : {
    address : false,
    telephone :false,
  },

  openGraph: {
    title: "PrepFlow",
    description: "An Interview Preparation Platform with AI-powered features.",
  },
};
export const viewport: Viewport = {
  colorScheme : 'dark'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} no-scrollbar antialiased bg-background w-screen h-lvh`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
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
      </body>
    </html>
  );
}
