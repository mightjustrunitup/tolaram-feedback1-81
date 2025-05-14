
import React, { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-gray-50">
      <Header />
      <div className="flex-1 py-8 px-6 relative pt-24 md:pt-28">
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
