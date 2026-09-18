import type { Metadata } from "next";
import { Playfair_Display, Tajawal } from "next/font/google";
import "./globals.css";
import DynamicIsland from "@/components/DynamicIsland";
import HardwareAcceleratedBackground from "@/components/HardwareAcceleratedBackground";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair" 
});

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"], 
  weight: ["300", "400", "500", "700"], 
  variable: "--font-tajawal" 
});

export const metadata: Metadata = {
  title: "العقل في الصندوق | Mind In Box",
  description: "المنصة الفلسفية الرقمية لاستعادة السيادة على الفكر وترويض الوجدان",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${tajawal.variable} ${playfair.variable} font-sans bg-[#040404] text-[#EAEAEA] antialiased selection:bg-[#D4AF37]/30 selection:text-[#EAEAEA] min-h-screen flex flex-col leading-[1.8]`}>
        <GlobalErrorBoundary>
          <HardwareAcceleratedBackground />
          <DynamicIsland />
          <main className="flex-1 relative z-10 pt-28 pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
