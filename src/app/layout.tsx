import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/shared/providers/QueryProvider'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { AuthGuard } from '@/shared/providers/AuthGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Music Mood Dashboard',
  description: 'Analise o seu humor baseado nas suas músicas.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" data-theme="dark">
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <AuthGuard>{children}</AuthGuard>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
