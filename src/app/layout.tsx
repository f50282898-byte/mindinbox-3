import type { Metadata } from "next";
import { Playfair_Display, Tajawal } from "next/font/google";
import "./globals.css";
import DynamicIsland from "@/components/DynamicIsland";
import HardwareAcceleratedBackground from "@/components/HardwareAcceleratedBackground";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const tajawal = Tajawal({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "700"], variable: "--font-tajawal" });

export const metadata: Metadata = {
  title: "Mind In Box V3.0 | The Digital Fortress",
  description: "The hyper-scalable luxury SaaS platform. The Sanctuary of the Self.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${tajawal.variable} ${playfair.variable} font-sans bg-[#030303] text-[#EAEAEA] antialiased selection:bg-[#D4AF37]/30 selection:text-[#EAEAEA] min-h-screen flex flex-col leading-[1.8]`}>
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
