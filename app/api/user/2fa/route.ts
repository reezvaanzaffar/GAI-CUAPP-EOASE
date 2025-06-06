import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  // Generate a TOTP secret and QR code for the authenticated user
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const speakeasy = (await import('speakeasy')).default;
  const qrcode = (await import('qrcode')).default;
  const secret = speakeasy.generateSecret({ length: 32, name: `YourApp (${session.user.email})` });
  const qr = await qrcode.toDataURL(secret.otpauth_url!);
  // Store the secret temporarily in the user record (not enabled yet)
  await prisma.user.update({
    where: { email: session.user.email },
    data: { twoFactorTempSecret: secret.base32 },
  });
  return NextResponse.json({ otpauth_url: secret.otpauth_url, qr });
}

export async function PUT(req: Request) {
  // Verify the TOTP code and enable 2FA
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { code } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !user.twoFactorTempSecret) {
    return NextResponse.json({ error: 'No 2FA setup in progress' }, { status: 400 });
  }
  const speakeasy = (await import('speakeasy')).default;
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorTempSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });
  if (!verified) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      twoFactorSecret: user.twoFactorTempSecret,
      twoFactorEnabled: true,
      twoFactorTempSecret: null,
    },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  // Disable 2FA for the authenticated user
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      twoFactorSecret: null,
      twoFactorEnabled: false,
      twoFactorTempSecret: null,
    },
  });
  return NextResponse.json({ success: true });
} 