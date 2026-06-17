'use client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ActiveThemeProvider } from '../themes/active-theme';
import { ConditionalSessionProvider } from './conditional-session-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <ConditionalSessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        disableTransitionOnChange
        enableColorScheme
      >
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          {children}
        </ActiveThemeProvider>
      </ThemeProvider>
    </ConditionalSessionProvider>
  );
}
