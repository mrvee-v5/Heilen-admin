import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AlertProvider } from '@/components/context/AlertContext';
import AlertWrapper from '@/components/ui/alert/AlertWrapper';


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AlertProvider>

          <ThemeProvider>
            <SidebarProvider>

              {children}

            </SidebarProvider>
          </ThemeProvider>
        </AlertProvider>
      </body>
    </html>
  );
}