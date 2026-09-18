import type { Metadata } from "next";
import { Playfair_Display, Tajawal } from "next/font/google";
import "./globals.css";
import DynamicIsland from "@/components/DynamicIsland";
import CinematicBackground from "@/components/CinematicBackground";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "العقل في الصندوق | Mind In Box",
  description: "المنصة الفلسفية الرقمية لاستعادة السيادة على الفكر وترويض الوجدان",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body
        className={`${tajawal.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
        style={{ background: "var(--bg-void)", color: "var(--text-primary)" }}
      >
        <GlobalErrorBoundary>
          <AuthProvider>
            {/* The Global Cinematic Video Engine — sits behind everything */}
            <CinematicBackground />

            {/* Floating navigation pill */}
            <DynamicIsland />

            {/* Page content — sits above the background */}
            <main
              className="flex-1 relative pt-28 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full"
              style={{ zIndex: 10 }}
            >
              {children}
            </main>
          </AuthProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
