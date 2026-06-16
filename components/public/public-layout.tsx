import { ReactNode } from "react";
import { PublicNav } from "./public-nav";
import { PublicVideoBackground } from "./public-video-background";

interface PublicLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function PublicLayout({ children, showSidebar = false }: PublicLayoutProps) {
  if (showSidebar) {
    return (
      <div className="min-h-screen bg-background flex relative">
        <PublicNav />
        
        <PublicVideoBackground />
        
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 pt-24">
          <div className="w-full max-w-2xl flex flex-col h-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}