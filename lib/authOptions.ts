import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { SecurityService } from './security';

console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        twoFactorCode: { label: '2FA Code', type: 'text', optional: true },
        userId: { label: 'User ID', type: 'text', optional: true },
        rememberDevice: { label: 'Remember Device', type: 'checkbox', optional: true },
      },
      async authorize(credentials, req) {
        const ipAddress = req?.headers['x-forwarded-for'] || req?.headers['x-real-ip'] || '';
        const userAgent = req?.headers['user-agent'] || '';
        // If userId and twoFactorCode are provided, this is a 2FA verification step
        if (credentials?.userId && credentials?.twoFactorCode) {
          const user = await prisma.user.findUnique({ where: { id: credentials.userId } });
          if (!user || !(user as any).twoFactorEnabled || !(user as any).twoFactorSecret) {
            throw new Error('2FA not enabled');
          }
          const speakeasy = (await import('speakeasy')).default;
          const verified = speakeasy.totp.verify({
            secret: (user as any).twoFactorSecret,
            encoding: 'base32',
            token: credentials.twoFactorCode,
            window: 1,
          });
          if (!verified) {
            await SecurityService.recordLoginAttempt({
              userId: user.id,
              email: user.email,
              ipAddress,
              userAgent,
            }, false);
            throw new Error('Invalid 2FA code');
          }
          // 2FA passed, record success and trust device if requested
          await SecurityService.recordLoginAttempt({
            userId: user.id,
            email: user.email,
            ipAddress,
            userAgent,
          }, true);
          if (credentials.rememberDevice) {
            await SecurityService.trustDevice(user.id, userAgent, ipAddress);
          }
          return user;
        }
        // Normal login step
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          await SecurityService.recordLoginAttempt({
            userId: user.id,
            email: user.email,
            ipAddress,
            userAgent,
          }, false);
          return null;
        }
        // Assess risk
        const risk = await SecurityService.assessLoginRisk({
          userId: user.id,
          email: user.email,
          ipAddress,
          userAgent,
        });
        if (risk.requires2FA && !(user as any).twoFactorEnabled) {
          // If high risk but 2FA not enabled, block login
          await SecurityService.recordLoginAttempt({
            userId: user.id,
            email: user.email,
            ipAddress,
            userAgent,
          }, false);
          throw new Error('High risk login: 2FA required but not enabled.');
        }
        if ((user as any).twoFactorEnabled && !credentials?.twoFactorCode) {
          // 2FA required, throw special error
          await SecurityService.recordLoginAttempt({
            userId: user.id,
            email: user.email,
            ipAddress,
            userAgent,
          }, true);
          throw new Error(`2FA_REQUIRED:${user.id}`);
        }
        // If high risk and not a trusted device, require 2FA
        if (risk.requiresTrustedDevice) {
          await SecurityService.recordLoginAttempt({
            userId: user.id,
            email: user.email,
            ipAddress,
            userAgent,
          }, false);
          throw new Error('Untrusted device: Please verify this device.');
        }
        // No 2FA or trusted device required, record success
        await SecurityService.recordLoginAttempt({
          userId: user.id,
          email: user.email,
          ipAddress,
          userAgent,
        }, true);
        if (credentials.rememberDevice) {
          await SecurityService.trustDevice(user.id, userAgent, ipAddress);
        }
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth logins, ensure the user exists in the DB
      if (account?.provider !== 'credentials') {
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (!dbUser) {
          // Optionally, set default role to 'sales' or 'USER'
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              role: 'sales', // or 'USER' as default
              emailVerified: true,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Always fetch the latest role from the database for returning users (including OAuth)
      if (token?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.role = dbUser.role || 'USER';
          token.sub = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      const role = token?.role;
      if (role === 'sales') {
        return `${baseUrl}/sales/dashboard`;
      }
      return `${baseUrl}/dashboard`;
    },
  },
};