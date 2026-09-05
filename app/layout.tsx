import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "DesiLearCode — Open Technology & STEM Infrastructure",
  description: "Nonprofit infrastructure connecting refurbished computing hardware, engineering mentors, and verified grassroots learning labs across India.",
  keywords: ["tech education for kids", "device donation logistics", "volunteer coding mentor", "verified ngo tech support", "child digital literacy"],
  openGraph: {
    title: "DesiLearCode — Open Technology & STEM Infrastructure",
    description: "Refurbished hardware, structured coding curricula, and verified grassroots classrooms across India.",
    type: "website",
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
