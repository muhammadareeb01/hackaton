import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { Sidebar } from "@/components/admin/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Portal - CitySync",
  description: "CitySync Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-[#f8fafc]">
          <Sidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
