import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";

// 优化字体加载：自动子集化、预加载、字体显示优化
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Rongqi Auto Service",
  description: "Professional auto export platform",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

