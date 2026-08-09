import type { Metadata } from "next";
import { Inter, Outfit, Syne, Playfair_Display } from "next/font/google";
import { ToastProvider } from "@/components/ToastProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "AI Smart Civic Services",
  description: "Report local civic problems easily.",
};

import { Chatbot } from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${syne.variable} ${playfair.variable} font-sans antialiased bg-[var(--color-background)]`}>
        <Navbar />
        {children}
        <Chatbot />
        <ToastProvider />
      </body>
    </html>
  );
}
