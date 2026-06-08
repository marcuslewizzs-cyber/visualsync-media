import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VisualSync Media - Professional Video Production',
  description: 'Professional video editing, content creation, and media production services.',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      width: '100%',
      maxWidth: 'none',
      margin: 0,
      padding: 0,
      display: 'block'
    }} className="relative bg-white text-black antialiased font-body">
      <div className="bg-noise"></div>
      <Navbar />
      <div className="w-full min-h-screen selection:bg-[#ff1a1a] selection:text-white">
        {children}
      </div>
      <Footer />
    </div>
  );
}
