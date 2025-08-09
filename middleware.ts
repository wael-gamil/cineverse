import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  // Routes that require authentication
  const protectedRoutes = ['/watchlist'];

  // Check if current path is the user's own profile (exactly /profile)
  const isOwnProfile = pathname === '/profile';

  // Routes that should redirect if already authenticated
  const authRoutes = ['/login', '/register', '/forget-password', '/auth'];

  // Check if current path is protected
  const isProtectedRoute =
    protectedRoutes.some(route => pathname.startsWith(route)) || isOwnProfile;

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    
    // Only set redirect if the current path is NOT an auth route
    // This prevents auth pages from being stored as redirect destinations
    if (!isAuthRoute) {
      loginUrl.searchParams.set('redirect', pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth routes with token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
