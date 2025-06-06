"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LinkedInCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;
    const exchangeToken = async () => {
      try {
        const res = await fetch(
          `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${window.location.origin}/auth/linkedin/callback&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_SECRET}`,
          { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        const data = await res.json();
        if (data.access_token) {
          window.opener?.postMessage({ type: "linkedin_oauth_token", token: data.access_token }, window.location.origin);
          window.close();
        }
      } catch (err) {
        // handle error
      }
    };
    exchangeToken();
  }, [searchParams]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h2>Completing LinkedIn authentication...</h2>
      <p>You can close this window once authentication is complete.</p>
    </div>
  );
} 