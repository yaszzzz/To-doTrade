import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import { cookies } from "next/headers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: "AxellTrade - Professional Trading Journal & Analytics",
  description: "Platform trading journal, analytics, backtesting, dan signal management untuk trader profesional",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.dark,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value || "vercel";

  return (
    <html
      lang="id"
      suppressHydrationWarning
      data-theme={activeThemeValue}
      className={`${inter.variable} dark`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Default to dark mode
                if (!localStorage.theme || localStorage.theme === 'dark' || localStorage.theme === 'system') {
                  document.documentElement.classList.add('dark');
                  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')
                } else if (localStorage.theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.light}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-background overflow-x-hidden overscroll-none font-sans antialiased">
        <Providers activeThemeValue={activeThemeValue}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
