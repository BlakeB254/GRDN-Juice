import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Debug logging
  console.log('Middleware running for:', pathname);
  
  // Get the token from cookies
  const token = request.cookies.get('auth-token')?.value;
  console.log('Auth token present:', !!token);
  
  // Verify user authentication
  const user = token ? verifyToken(token) : null;
  console.log('User authenticated:', !!user, user ? `Role: ${user.role}` : 'No user');
  
  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Protected customer routes
  const protectedRoutes = ['/dashboard', '/orders', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect authenticated users away from auth pages
  const authPages = ['/login', '/signup'];
  if (authPages.includes(pathname) && user) {
    // Redirect based on role
    if (user.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico|public|images).*)',
  ],
};