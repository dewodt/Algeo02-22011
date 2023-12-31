"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  // Navbar State
  const [navBarExpanded, setNavBarExpanded] = useState(false);

  // Set navbar to close everytime path changes (next defaults to client side navigation, so state remains)
  const pathname = usePathname();
  useEffect(() => {
    setNavBarExpanded(false);
  }, [pathname]);

  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="light">
        <body
          className={`flex min-h-screen flex-col bg-background font-inter ${
            navBarExpanded && "overflow-hidden"
          }`}
        >
          <NavBar
            navBarExpanded={navBarExpanded}
            setNavBarExpanded={setNavBarExpanded}
          />
          {children}
          <Footer />
          <Toaster />
        </body>
      </ThemeProvider>
    </html>
  );
};

export default RootLayout;
