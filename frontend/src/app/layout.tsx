import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'NUST Hostel Management System',
  description: 'Manage hostel operations efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="glass-bg text-foreground min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen glass-scope">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
