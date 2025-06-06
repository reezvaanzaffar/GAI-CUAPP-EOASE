import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { ip, userAgent } = await req.json();
  const emailContent = `
    <h1>New Login Alert</h1>
    <p>A new login was detected for your account.</p>
    <p>Time: ${new Date().toLocaleString()}</p>
    <p>IP: ${ip}</p>
    <p>Device: ${userAgent}</p>
    <p>If this was not you, please secure your account immediately.</p>
  `;
  await sendEmail({
    to: session.user.email,
    subject: 'New Login Alert',
    html: emailContent,
  });
  return NextResponse.json({ success: true });
} 