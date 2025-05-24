import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'
import { MergeProvider } from '@/context/MergeContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'PDF Guide',
  description: 'Your all-in-one PDF manipulation tool',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <MergeProvider>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <header className="flex justify-between items-center p-4 gap-4 h-16 bg-gray-100">
              <div className="flex items-center gap-6">
                <h1 className="text-gray-800 text-xl font-bold">PDF Guide</h1>
                <nav className="flex space-x-6">
                  <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg">Home</Link>
                  <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg">About</Link>
                  <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg">Contact</Link>
                </nav>

              </div>
              <div className="flex text-gray-700 items-center gap-4">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </header>
            {children}
          </body>
        </html>
      </MergeProvider>
    </ClerkProvider>
  )
}