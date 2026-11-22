import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SafeguardingBanner } from "@/components/SafeguardingBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const rawUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
const appUrl = rawUrl && !rawUrl.includes('[SENSITIVE]') && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
  ? rawUrl
  : 'https://desilearncode.vercel.app';

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "DesiLearCode — Open Technology & STEM Infrastructure",
    template: "%s | DesiLearCode",
  },
  description: "Nonprofit infrastructure connecting refurbished computing hardware, engineering mentors, and verified grassroots learning labs across India.",
  keywords: [
    "tech education for kids",
    "device donation logistics",
    "volunteer coding mentor",
    "verified ngo tech support",
    "child digital literacy",
    "refurbished laptops india",
    "stem education ngo"
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "DesiLearCode — Open Technology & STEM Infrastructure",
    description: "Refurbished hardware, structured coding curricula, and verified grassroots classrooms across India.",
    type: "website",
    url: appUrl,
    siteName: "DesiLearCode",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "DesiLearCode Open Technology & STEM Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DesiLearCode — Open Technology & STEM Infrastructure",
    description: "Refurbished hardware, structured coding curricula, and verified grassroots classrooms across India.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary-600 selection:text-white">
        <AuthProvider>
          <SafeguardingBanner compact />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
