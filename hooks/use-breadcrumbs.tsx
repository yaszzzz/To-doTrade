'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Custom title mapping for ToDoTrade routes
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/portfolio': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Portfolio', link: '/dashboard/portfolio' }
  ],
  '/dashboard/signals': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Signals', link: '/dashboard/signals' }
  ],
  '/dashboard/signals/new': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Signals', link: '/dashboard/signals' },
    { title: 'Create Signal', link: '/dashboard/signals/new' }
  ],
  '/dashboard/backtest': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Backtest', link: '/dashboard/backtest' }
  ],
  '/dashboard/strategy-vault': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Strategy Vault', link: '/dashboard/strategy-vault' }
  ],
  '/dashboard/analytics': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Analytics', link: '/dashboard/analytics' }
  ],
  '/dashboard/journal': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Journal', link: '/dashboard/journal' }
  ],
  '/dashboard/journal/new': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Journal', link: '/dashboard/journal' },
    { title: 'New Entry', link: '/dashboard/journal/new' }
  ]
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}