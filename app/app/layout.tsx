import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from './contexts/CartContext';
import { Toaster, DefaultToastOptions } from 'react-hot-toast';
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

const configuracaoToast: DefaultToastOptions = {
  duration: 3000,
  style: {
      padding: '16px',
      borderRadius: '12px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    },

    success: {
      style: {
        background: '#4ade80',
        color: '#000000',
        border: '1px solid #22c55e',
      },
    },

    error: {
      duration: 5000,
      style: {
        background: '#f87171',
        color: '#000000',
        border: '1px solid #ef4444',
      },
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} bg-neutral-950 text-white min-h-screen flex flex-col antialiased`}>
       <Toaster position="top-right" reverseOrder={false} toastOptions={configuracaoToast}/>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}