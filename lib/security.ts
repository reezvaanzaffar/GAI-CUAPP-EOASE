import { prisma } from '../lib/prisma';
// If you see a type error for UAParser, run: npm install ua-parser-js @types/ua-parser-js
import { UAParser } from 'ua-parser-js';

export interface RiskFactors {
  ipAddress: string;
  userAgent: string;
  email: string;
  userId?: string;
  location?: any;
}

// Server-side device type detection based on user agent
function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' | 'unknown' {
  if (!userAgent) return 'unknown';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'mobile';
  }
  return 'desktop';
}

export class SecurityService {
  private static calculateRiskScore(factors: RiskFactors): number {
    let score = 0;
    const parser = new UAParser(factors.userAgent);
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    // Check for known malicious IPs (implement your own IP reputation service)
    // score += await this.checkIPReputation(factors.ipAddress);

    // Check for suspicious user agents
    if (!browser.name || !os.name) {
      score += 20;
    }

    // Check for known bot user agents
    if (factors.userAgent.toLowerCase().includes('bot') || 
        factors.userAgent.toLowerCase().includes('crawler')) {
      score += 30;
    }

    // Check for unusual device types
    if (device.type === undefined) {
      score += 15;
    }

    // Check for unusual locations (implement your own geo-location service)
    // score += await this.checkLocationRisk(factors.location);

    return Math.min(score, 100);
  }

  static async assessLoginRisk(factors: RiskFactors): Promise<{
    riskScore: number;
    requires2FA: boolean;
    requiresTrustedDevice: boolean;
  }> {
    let riskScore = await this.calculateRiskScore(factors);
    
    // Get user's previous login attempts
    const previousAttempts = await prisma.loginAttempt.findMany({
      where: {
        OR: [
          { email: factors.email },
          { userId: factors.userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Calculate risk based on previous attempts
    const failedAttempts = previousAttempts.filter((a: { success: boolean }) => !a.success).length;
    if (failedAttempts > 0) {
      riskScore += failedAttempts * 10;
    }

    // Check if this is a known trusted device
    const deviceId = this.generateDeviceId(factors.userAgent);
    const trustedDevice = factors.userId ? await prisma.trustedDevice.findFirst({
      where: {
        userId: factors.userId,
        deviceId,
        isTrusted: true,
        trustExpiry: { gt: new Date() }
      }
    }) : null;

    return {
      riskScore: Math.min(riskScore, 100),
      requires2FA: riskScore >= 50,
      requiresTrustedDevice: riskScore >= 70 && !trustedDevice
    };
  }

  static async recordLoginAttempt(factors: RiskFactors, success: boolean): Promise<void> {
    const riskScore = await this.calculateRiskScore(factors);
    const deviceId = this.generateDeviceId(factors.userAgent);
    const deviceType = getDeviceType(factors.userAgent);

    await prisma.loginAttempt.create({
      data: {
        userId: factors.userId,
        email: factors.email,
        ipAddress: factors.ipAddress,
        userAgent: factors.userAgent,
        success,
        riskScore,
        deviceType,
        location: factors.location
      }
    });

    if (success && factors.userId) {
      // Update user's risk score
      await prisma.user.update({
        where: { id: factors.userId },
        data: {
          riskScore: riskScore,
          lastRiskAssessment: new Date()
        }
      });
    }
  }

  static async trustDevice(userId: string, userAgent: string, ipAddress: string): Promise<void> {
    const deviceId = this.generateDeviceId(userAgent);
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();

    const deviceName = `${browser.name || 'Unknown'} on ${os.name || 'Unknown'} ${device.type ? `(${device.type})` : ''}`;

    await prisma.trustedDevice.create({
      data: {
        userId,
        deviceId,
        deviceName,
        deviceType: getDeviceType(userAgent),
        ipAddress,
        userAgent,
        isTrusted: true,
        trustExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });
  }

  private static generateDeviceId(userAgent: string): string {
    // Generate a unique device ID based on user agent
    // This is a simple implementation - you might want to use a more sophisticated method
    return Buffer.from(userAgent).toString('base64');
  }
} 