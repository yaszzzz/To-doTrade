'use client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ActiveThemeProvider } from '../themes/active-theme';
import { SessionProvider } from 'next-auth/react';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          {children}
        </ActiveThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
