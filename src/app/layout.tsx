import type { Metadata } from "next";
import { Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import CinematicBackground from "@/components/CinematicBackground";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayout from "@/components/ClientLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

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
        className={`${tajawal.variable} ${reemKufi.variable} antialiased min-h-screen flex flex-col`}
        style={{ background: "var(--bg-void)", color: "var(--text-primary)", fontFamily: "var(--font-tajawal), sans-serif" }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <GlobalErrorBoundary>
            <AuthProvider>
              <CinematicBackground />

              <ClientLayout>
                {children}
              </ClientLayout>
            </AuthProvider>
          </GlobalErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
