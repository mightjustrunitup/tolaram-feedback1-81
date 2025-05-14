
import React from "react";
import Logo from "@/components/layout/Logo";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b py-4 px-6 shadow-md fixed top-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <Logo />
      </div>
    </header>
  );
};
