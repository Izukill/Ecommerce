import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from './contexts/CartContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MirlleFitness",
  description: "Moda Fitness e Praia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-white min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}