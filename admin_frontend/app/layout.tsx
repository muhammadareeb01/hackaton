import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { Sidebar } from "@/components/admin/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Portal - SmartCity",
  description: "SmartCity Admin Dashboard",
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
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1">
              {children}
            </main>
            {/* Simple Admin Footer */}
            <footer className="py-4 border-t border-gray-200/80 bg-white text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} SmartCity Admin Operations Portal
            </footer>
          </div>
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
