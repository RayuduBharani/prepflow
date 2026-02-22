import React, { Suspense } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "./ui/tooltip";
import { Analytics } from "@vercel/analytics/next";
import Loading from "@/app/loading";
import Navbar from "./Navbar";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import { ActiveThemeProvider } from "./active-theme";
const Footer = dynamic(() => import("@/components/Footer"));

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
        disableTransitionOnChange
      >
        <TooltipProvider>
          <ActiveThemeProvider>
            <Suspense fallback={<Loading />}>
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </Suspense>
          </ActiveThemeProvider>
        </TooltipProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
};

export default AllProviders;
