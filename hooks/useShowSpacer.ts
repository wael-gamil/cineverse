import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Hook to determine if the spacer should be shown based on current route
 * Includes all pages that need spacer + all not-found scenarios
 */
export function useShowSpacer(isMobile: boolean, trailerFocusMode: boolean) {
  const pathname = usePathname();
  const [shouldShowSpacer, setShouldShowSpacer] = useState(true);

  useEffect(() => {
    // Don't show spacer in trailer focus mode
    if (trailerFocusMode) {
      setShouldShowSpacer(false);
      return;
    }

    // Paths that explicitly need spacer
    const allowedPathsWithSpacer = [
      '/explore',
      '/reviews',
      '/search',
      '/watchlist',
      '/crew',
      '/profile',
      '/login',
      '/register',
      '/verify',
      '/forget-password',
      '/reset-password',
      '/oauth2/success',
      ...(isMobile ? ['/'] : []),
    ];

    // Check if current path matches any allowed paths
    const matchesAllowedPath = allowedPathsWithSpacer.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    );

    // For mobile: single slug pages (like /movie-name) should show spacer
    const isSingleSlugPage =
      isMobile &&
      /^\/[^/]+$/.test(pathname) &&
      !allowedPathsWithSpacer.includes(pathname);

    // Desktop home page shouldn't show spacer (unless mobile)
    const isHomePage = pathname === '/';
    const shouldHideOnDesktopHome = !isMobile && isHomePage;

    // Show spacer if:
    // 1. Matches allowed paths, OR
    // 2. Is a single slug page on mobile, OR
    // 3. Any other page (including not-found scenarios)
    // BUT NOT on desktop home page
    const shouldShow =
      !shouldHideOnDesktopHome &&
      (matchesAllowedPath ||
        isSingleSlugPage ||
        (!matchesAllowedPath && !isHomePage));

    setShouldShowSpacer(shouldShow);
  }, [pathname, isMobile, trailerFocusMode]);

  return shouldShowSpacer;
}
