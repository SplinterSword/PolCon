import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polcon",
  description: "Get Contradictions made by politicians within seconds with Polcon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${newsreader.variable} ${manrope.variable} antialiased selection:bg-primary/30 selection:text-primary min-h-screen relative`}
      >
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/15 rounded-full blur-[120px]"></div>
        </div>

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
