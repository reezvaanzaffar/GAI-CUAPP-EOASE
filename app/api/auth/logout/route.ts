import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// This custom logout route is deprecated. Use NextAuth's /api/auth/signout endpoint instead.
export async function POST() {
  return new Response(
    JSON.stringify({ error: 'Use /api/auth/signout (NextAuth) for logout.' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}