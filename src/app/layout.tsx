import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import AmbientBackground from "@/components/ui/AmbientBackground";
import ServiceWorkerKill from "@/components/ui/ServiceWorkerKill";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "FSTD Cert Manager | AW109E Power",
  description: "Sistema de gestión para la certificación ANAC de simuladores de vuelo AgustaWestland AW109E Power bajo normativa RAAC Parte 60.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0a0c10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <ServiceWorkerKill />
        <AmbientBackground />
        <Sidebar />
        <main className="ml-72 min-h-screen p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
