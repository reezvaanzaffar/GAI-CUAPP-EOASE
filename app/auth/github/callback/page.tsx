'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GitHubCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      // Exchange code for token
      fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            // Send token to parent window
            window.opener.postMessage(
              {
                type: 'github-oauth',
                token: data.access_token,
              },
              window.location.origin
            );
          }
        })
        .catch((error) => {
          console.error('GitHub OAuth error:', error);
        });
    }
  }, [searchParams]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Completing GitHub Authentication...</h2>
      <p>You can close this window once the process is complete.</p>
    </div>
  );
} 