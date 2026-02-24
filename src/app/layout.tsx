import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Substituindo a SF Pro para web
import './globals.css'
import { QueryProvider } from '@/shared/providers/QueryProvider'


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
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}