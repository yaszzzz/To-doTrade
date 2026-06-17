'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function ConditionalSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Public routes that don't need session
  const isPublicRoute = useMemo(() => {
    const publicRoutes = ['/', '/login', '/register', '/public'];
    return publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );
  }, [pathname]);

  // For public routes, don't wrap with SessionProvider
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For authenticated routes, use SessionProvider
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
