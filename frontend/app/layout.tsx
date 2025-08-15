import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/contexts/auth-context"
import { FileProvider } from "@/contexts/file-context"
import { SharingProvider } from "@/contexts/sharing-context"
import { CommentsProvider } from "@/contexts/comments-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Google Drive",
  description: "Tu espacio personal de almacenamiento en la nube",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <FileProvider>
            <SharingProvider>
              <CommentsProvider>
                {children}
                <Toaster />
              </CommentsProvider>
            </SharingProvider>
          </FileProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
