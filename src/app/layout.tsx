import type { Metadata } from "next";
import { Reem_Kufi, Tajawal } from "next/font/google";
import "./globals.css";
import CinematicBackground from "@/components/CinematicBackground";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

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
            <CinematicBackground />

            <div className="flex h-[100svh] w-full overflow-hidden relative">
              <Sidebar />
              
              <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
                <TopBar />
                
                <main className="flex-1 relative w-full h-full flex flex-col z-10 overflow-hidden">
                  {children}
                </main>
              </div>
            </div>
          </AuthProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
