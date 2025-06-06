"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function FacebookCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;
    const exchangeToken = async () => {
      try {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/facebook/callback&client_secret=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET}&code=${code}`
        );
        const data = await res.json();
        if (data.access_token) {
          window.opener?.postMessage({ type: "facebook_oauth_token", token: data.access_token }, window.location.origin);
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
      <h2>Completing Facebook authentication...</h2>
      <p>You can close this window once authentication is complete.</p>
    </div>
  );
} 