import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ToastProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SmartCity — AI-Powered Smart City Platform",
  description: "Report civic issues instantly with AI triage, real-time tracking, and smart city integration.",
  keywords: "civic complaints, smart city, AI, urban issues, SmartCity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased bg-[var(--color-background)] text-[var(--color-text-primary)] overflow-x-hidden`}
      >
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Chatbot />
          <ToastProvider />
        </div>
      </body>
    </html>
  );
}
