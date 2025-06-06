"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/Button";

export default function AccountSettings() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionToken, setCurrentSessionToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch sessions
    const fetchSessions = async () => {
      const res = await fetch("/api/user/sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
    };
    fetchSessions();
    // Get current session token from cookie
    const match = document.cookie.match(/session_token=([^;]+)/);
    setCurrentSessionToken(match ? match[1] : null);
  }, []);

  const handleEnable2FA = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/2fa", {
        method: "POST",
      });
      const data = await response.json();
      if (data.qr) {
        setQrCode(data.qr);
      }
    } catch (error) {
      window.alert("Failed to generate 2FA setup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/2fa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await response.json();
      if (data.success) {
        setIs2FAEnabled(true);
        setQrCode(null);
        window.alert("2FA enabled successfully");
      } else {
        window.alert("Invalid verification code");
      }
    } catch (error) {
      window.alert("Failed to verify 2FA code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/2fa", {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setIs2FAEnabled(false);
        window.alert("2FA disabled successfully");
      }
    } catch (error) {
      window.alert("Failed to disable 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/sessions/${sessionToken}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSessions((prev) => prev.filter((s) => s.sessionToken !== sessionToken));
        window.alert("Session revoked");
      } else {
        window.alert(data.error || "Failed to revoke session");
      }
    } catch (e) {
      window.alert("Failed to revoke session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="mb-6 border rounded p-4">
        <h2 className="font-semibold mb-2">Two-Factor Authentication</h2>
        {!is2FAEnabled && !qrCode && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <Button onClick={handleEnable2FA} disabled={isLoading}>
              Enable 2FA
            </Button>
          </div>
        )}
        {qrCode && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Scan this QR code with your authenticator app (like Google Authenticator or Authy)
            </p>
            <div className="flex justify-center">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="border rounded px-2 py-1"
              />
              <Button onClick={handleVerify2FA} disabled={isLoading}>
                Verify and Enable
              </Button>
            </div>
          </div>
        )}
        {is2FAEnabled && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Two-factor authentication is currently enabled for your account.
            </p>
            <Button onClick={handleDisable2FA} disabled={isLoading} variant="secondary">
              Disable 2FA
            </Button>
          </div>
        )}
      </div>
      <div className="mb-6 border rounded p-4">
        <h2 className="font-semibold mb-2">Active Sessions</h2>
        <p className="text-xs text-gray-500 mb-2">For your security, we log device and IP info for each session. This data is handled per our privacy policy.</p>
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-600">No active sessions found.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.sessionToken} className="flex flex-col md:flex-row md:items-center md:justify-between border rounded p-2">
                <div>
                  <div className="text-xs text-gray-700">Session ID: {s.id}</div>
                  <div className="text-xs text-gray-500">Created: {s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'}</div>
                  <div className="text-xs text-gray-500">Expires: {new Date(s.expires).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">IP: {s.ipAddress || 'Unknown'}</div>
                  <div className="text-xs text-gray-500">Device: {s.userAgent || 'Unknown'}</div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isLoading || s.sessionToken === currentSessionToken}
                  onClick={() => handleRevokeSession(s.sessionToken)}
                  className="mt-2 md:mt-0"
                >
                  {s.sessionToken === currentSessionToken ? "Current Session" : "Revoke"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 