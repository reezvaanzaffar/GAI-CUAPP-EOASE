import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://accounts.google.com https://apis.google.com;",
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window
const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now - data.timestamp > RATE_LIMIT_WINDOW) {
      ipRequestCounts.delete(ip);
    }
  }
}, RATE_LIMIT_WINDOW);

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limiting
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const requestData = ipRequestCounts.get(ip) || { count: 0, timestamp: now };

  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    // Reset count for new window
    requestData.count = 1;
    requestData.timestamp = now;
  } else if (requestData.count >= MAX_REQUESTS) {
    // Rate limit exceeded
    return new NextResponse('Too Many Requests', { status: 429 });
  } else {
    // Increment count
    requestData.count++;
  }

  ipRequestCounts.set(ip, requestData);

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
  response.headers.set('X-RateLimit-Remaining', (MAX_REQUESTS - requestData.count).toString());
  response.headers.set('X-RateLimit-Reset', (requestData.timestamp + RATE_LIMIT_WINDOW).toString());

  // Block suspicious requests
  const userAgent = request.headers.get('user-agent') || '';
  if (
    !userAgent ||
    userAgent.includes('curl') ||
    userAgent.includes('wget') ||
    userAgent.includes('python-requests')
  ) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Validate request origin
  const origin = request.headers.get('origin');
  if (origin && !origin.startsWith(process.env.NEXT_PUBLIC_APP_URL || '')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return response;
} 