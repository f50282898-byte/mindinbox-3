import type { Metadata } from "next";
import { Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import NavigationDrawer from "@/components/NavigationDrawer";
import CinematicBackground from "@/components/CinematicBackground";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  variable: "--font-reem-kufi",
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
        className={`${tajawal.variable} ${reemKufi.variable} font-sans antialiased min-h-screen flex flex-col`}
        style={{ background: "var(--bg-void)", color: "var(--text-primary)" }}
      >
        <GlobalErrorBoundary>
          <AuthProvider>
            {/* The Global Cinematic Video Engine — sits behind everything */}
            <CinematicBackground />

            {/* Floating Hamburger Navigation */}
            <NavigationDrawer />

            {/* Page content — sits above the background */}
            <main
              className="flex-1 relative w-full h-full flex flex-col"
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
