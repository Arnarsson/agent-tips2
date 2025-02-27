import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AI } from "@/ai/actions"
import { Provider } from "jotai"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProgressProvider } from "@/lib/contexts/UserProgressProvider"
import { SavedPromptsProvider } from "@/lib/contexts/saved-prompts-context"
import ErrorBoundary from "@/components/error-boundary"

import { ClientPortCheck } from "@/lib/error-handling/client-port-check"
import { BarChart3 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agent.tips - Prompt Engineering Academy",
  description:
    "Master the art of communicating with AI systems effectively. Learn prompt engineering through interactive examples and exercises.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}
      >
        <AI>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <UserProgressProvider>
                <SavedPromptsProvider>
                  <TooltipProvider>
                    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 bg-background/80 backdrop-blur-sm border-b">
                      <nav className="flex gap-4">
                        <Link href="/" className="text-sm hover:underline">Home</Link>
                        <Link href="/learn" className="text-sm hover:underline">Learn</Link>
                        <Link href="/profile" className="text-sm hover:underline">Profile</Link>
                        <Link href="/showcase" className="text-sm hover:underline">Component Showcase</Link>
                        <Link href="/admin/performance" className="text-sm hover:underline flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>Performance</span>
                        </Link>
                      </nav>
                    </div>
                    <main className="bg-background pt-12">
                      <ErrorBoundary>
                        {/* Add the client-side port check component */}
                        <ClientPortCheck />
                        {children}
                      </ErrorBoundary>
                    </main>
                  </TooltipProvider>

                  <Toaster />
                </SavedPromptsProvider>
              </UserProgressProvider>
            </ThemeProvider>
          </Provider>
        </AI>
      </body>
    </html>
  )
}
