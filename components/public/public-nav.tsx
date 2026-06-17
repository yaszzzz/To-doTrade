"use client";

import React, { useState, useEffect } from "react";
import { Home, Signal, BarChart3, LogIn } from "lucide-react";

const navItems = [
  { icon: Home, href: "#home", label: "Beranda" },
  { icon: Signal, href: "/public/signals", label: "Signal" },
  { icon: BarChart3, href: "/public/backtest", label: "Backtest" },
  { icon: LogIn, href: "/login", label: "Login" }, // menuju halaman login
];

export function PublicNav() {
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems
        .filter((item) => item.href.startsWith("#")) // abaikan /login
        .map((item) => item.href.substring(1));

      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 300;
        }
        return false;
      });

      if (current) setActiveSection(`#${current}`);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-10 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none">
      <nav className="flex items-center gap-2 p-2 bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const isActive =
            item.href.startsWith("#") && activeSection === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 group ${
                isActive
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform duration-500 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />

              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black border border-white/10 rounded-lg text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap">
                {item.label}
              </div>
            </a>
          );
        })}
      </nav>
    </div>
  );
}