import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./App.scss";
import Navbar from "@/components/Navbar/Navbar";
import AuthRefreshProvider from "@/presentation/providers/AuthRefreshProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Desarrollador por Lucas Cabral",
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
        <AuthRefreshProvider>
          <Navbar />
          {children}
        </AuthRefreshProvider>
      </body>
    </html>
  );
}
