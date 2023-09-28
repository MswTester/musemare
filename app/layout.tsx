import './styles/globals.scss'
import type { Metadata } from 'next'
import Head from 'next/head'
import { Black_Han_Sans, Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const black_han_sans = Black_Han_Sans({subsets: ['latin'],weight: '400'})

export const metadata: Metadata = {
  title: 'MuseMare',
  description: 'Are you ready to have an adventure with a guitar?',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={black_han_sans.className}>{children}</body>
    </html>
  )
}
