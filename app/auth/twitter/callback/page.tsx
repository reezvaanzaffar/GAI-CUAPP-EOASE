"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TwitterCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;
    const exchangeToken = async () => {
      try {
        const res = await fetch(
          `https://api.twitter.com/2/oauth2/token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa(`${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}:${process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET}`)}`
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code,
              redirect_uri: `${window.location.origin}/auth/twitter/callback`,
              client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '',
            }).toString()
          }
        );
        const data = await res.json();
        if (data.access_token) {
          window.opener?.postMessage({ type: "twitter_oauth_token", token: data.access_token }, window.location.origin);
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
      <h2>Completing Twitter authentication...</h2>
      <p>You can close this window once authentication is complete.</p>
    </div>
  );
} 