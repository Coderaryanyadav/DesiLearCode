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
  title: "TechForKids — Technology. Education. Opportunity.",
  description: "A transparent, privacy-first platform connecting donors, mentors, and verified child-care organizations to provide technology access, digital education, and refurbished hardware.",
  keywords: ["tech education for kids", "device donation", "volunteer coding mentor", "verified ngo tech support", "child digital literacy"],
  openGraph: {
    title: "TechForKids — Technology. Education. Opportunity.",
    description: "Bridging the digital divide for vulnerable children through verified organizations, hardware donations, and coding mentorship.",
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
      <body className="min-h-screen flex flex-col bg-[#FAFAF9] text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
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
