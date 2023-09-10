import './globals.css'

import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import ThemeProvider from "@/components/theme-provider"
import { ModalProvider } from '@/components/modal-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Let's Chat",
  description: 'A discord clone',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-white dark:bg-[#313338]`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="discord-theme">
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
