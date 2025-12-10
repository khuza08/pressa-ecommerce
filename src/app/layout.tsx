import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoriteProvider } from "@/context/FavoriteContext";
import { AuthProvider } from "@/context/AuthContext";
import { SWRConfig } from 'swr';
import { swrConfig } from '@/lib/swrConfig';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PRESSA - Premium T-Shirt Store",
  description: "Discover our premium collection of t-shirts and clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRConfig value={swrConfig}>
          <AuthProvider>
            <FavoriteProvider>
              <CartProvider>
                <Header />
                <main>{children}</main>
                <Footer />
              </CartProvider>
            </FavoriteProvider>
          </AuthProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
