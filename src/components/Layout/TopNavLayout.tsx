"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import Footer from "@/components/Footer";
import TopNavMenu from "@/components/Layout/TopNavMenu";
import ScrollToTop from "@/components/ScrollToTop";

interface TopNavLayoutProps {
  children: ReactNode;
}

export default function TopNavLayout({ children }: TopNavLayoutProps) {
  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {/* Top Navigation */}
      <TopNavMenu />
      
      {/* Main Content */}
      <main className="flex-grow w-full mx-auto bg-gradient-dark">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
}
