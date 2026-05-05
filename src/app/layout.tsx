import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "IB PYP Learning Practice",
  description:
    "A child-friendly home practice app inspired by IB PYP learning principles for early years learners.",
};

function NavBar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-blue-600 text-lg hover:text-blue-700"
          aria-label="Home"
        >
          🌟 Learning App
        </Link>
        <div className="flex gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/parent"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Parent
          </Link>
          <Link
            href="/objectives"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors hidden sm:block"
          >
            Objectives
          </Link>
          <Link
            href="/settings"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-amber-50 antialiased">
        <NavBar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-xs text-gray-400 py-4 px-4">
          This app is an independent home-practice tool inspired by IB PYP
          learning principles. It is not an official International Baccalaureate
          product.
        </footer>
      </body>
    </html>
  );
}
