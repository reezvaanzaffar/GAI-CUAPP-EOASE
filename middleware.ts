import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { securityMiddleware } from './middleware/security';

// Define public paths that don't require authentication
const publicPaths = ['/login', '/register', '/auth/login', '/auth/register', '/auth/verify-email'];

// Define protected paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin',
  '/api/protected',
];

// Define auth paths (login, register, etc.)
const authPaths = ['/login', '/register', '/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  // Apply security middleware first
  const securityResponse = securityMiddleware(request);
  if (securityResponse.status !== 200) {
    return securityResponse;
  }

  const path = request.nextUrl.pathname;

  // Check if the path is public
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Get the token using NextAuth JWT
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if the path requires authentication
  if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    if (!token) {
      // Redirect to login if not authenticated
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }

    // Check if the path is an auth path and user is already authenticated
    if (authPaths.some((authPath) => path.startsWith(authPath)) && token) {
      // Redirect to dashboard if already authenticated
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};