import "./globals.css"

import type { Metadata } from "next"
import { Inter_Tight } from "next/font/google"
import { AI } from "@/ai/actions"
import { Provider } from "jotai"
import { Toaster } from "sonner"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter_Tight({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agent.tips",
  description:
    "A local-first AI prompt manager to create, organize, and optimize your prompts offline.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("bg-background font-sans antialiased", inter.className)}
      >
        <AI>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 bg-background/80 backdrop-blur-sm border-b">
                  <nav className="flex gap-4">
                    <Link href="/" className="text-sm hover:underline">Home</Link>
                    <Link href="/learn" className="text-sm hover:underline">Learn</Link>
                    <Link href="/showcase" className="text-sm hover:underline">Component Showcase</Link>
                  </nav>
                </div>
                <main className="bg-background pt-12">{children}</main>
              </TooltipProvider>

              <Toaster />
            </ThemeProvider>
          </Provider>
        </AI>
      </body>
    </html>
  )
}
