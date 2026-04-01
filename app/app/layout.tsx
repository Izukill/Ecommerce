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
    background: '#88e788',
    color: '#fff',
    border: '1px solid #404040',
    padding: '16px',
    borderRadius: '12px',
  },
  success: {
    iconTheme: {
      primary: '#88e788',
      secondary: '#88e788',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
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