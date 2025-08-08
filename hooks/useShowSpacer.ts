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
    if (trailerFocusMode) {
      setShouldShowSpacer(false);
      return;
    }

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

    const matchesAllowedPath = allowedPathsWithSpacer.some(
      path => pathname === path || pathname.startsWith(`${path}/`)
    );

    // Detect not-found pages for [slug] (e.g. /something-not-found)
    const isSlugNotFound =
      pathname.startsWith('/') &&
      pathname.split('/').length === 2 &&
      typeof window !== 'undefined' &&
      document.body?.dataset?.notfound === 'true';

    // For mobile: single slug pages (like /movie-name) should show spacer
    const isSingleSlugPage =
      isMobile &&
      /^\/[^/]+$/.test(pathname) &&
      !allowedPathsWithSpacer.includes(pathname);

    // Desktop home page shouldn't show spacer (unless mobile)
    const isHomePage = pathname === '/';
    const shouldHideOnDesktopHome = !isMobile && isHomePage;

    // Hide spacer on working [slug] pages, show on not-found [slug] pages
    const isWorkingSlugPage =
      pathname.startsWith('/') &&
      pathname.split('/').length === 2 &&
      !isSlugNotFound;

    const shouldShow =
      !shouldHideOnDesktopHome &&
      (matchesAllowedPath ||
        isSingleSlugPage ||
        (!matchesAllowedPath && !isHomePage && !isWorkingSlugPage) ||
        isSlugNotFound);

    setShouldShowSpacer(shouldShow);
  }, [pathname, isMobile, trailerFocusMode]);

  return shouldShowSpacer;
}
