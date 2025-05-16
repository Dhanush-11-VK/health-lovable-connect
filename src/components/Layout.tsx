
import { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-1 mb-4 md:mb-0">
              <span className="text-healthcare-purple font-bold text-xl">Med</span>
              <span className="text-healthcare-blue font-bold text-xl">Connect</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} MedConnect. All rights reserved.
              HIPAA Compliant.
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
      <Sonner />
    </div>
  );
}
