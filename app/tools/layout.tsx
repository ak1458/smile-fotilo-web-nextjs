import type { ReactNode } from 'react';
import { Footer } from '../components/Footer';

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
