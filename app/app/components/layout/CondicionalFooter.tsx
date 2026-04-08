'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  //se a rota for admin ele retorna nada
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <Footer />;
}