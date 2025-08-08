import React, {Suspense} from 'react'
import ThemeDataProvider from './theme-data-provider'
import { ThemeProvider } from './theme-provider'
import { TooltipProvider } from './ui/tooltip'
import { Analytics } from "@vercel/analytics/next";
import Loading from '@/app/loading'
import Navbar from './Navbar'
import dynamic from 'next/dynamic'
import { Toaster } from 'sonner'
const Footer = dynamic(() => import("@/components/Footer"));

const AllProviders = ({children} : {children : React.ReactNode}) => {
  return (
<>

    <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <TooltipProvider>
            <ThemeDataProvider>
              <Suspense fallback={<Loading />}>
                <Navbar />
                {children}
                <Footer />
                <Toaster />
              </Suspense>
            </ThemeDataProvider>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
</>
  )
}

export default AllProviders