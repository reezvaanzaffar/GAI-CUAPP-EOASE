import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/token';
import { loginSchema } from '@/lib/validations/auth';
import { validateRequest } from '@/lib/middleware/validationMiddleware';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// This custom login route is deprecated. Use NextAuth's /api/auth/signin endpoint instead.
export async function POST(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Use /api/auth/signin (NextAuth) for login.' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}