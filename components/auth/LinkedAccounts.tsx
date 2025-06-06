'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/hooks/useAuth';

interface Account {
  id: string;
  provider: string;
  providerAccountId: string;
}

export default function LinkedAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      const response = await fetch('/api/auth/linked-accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch linked accounts');
      }
      const data = await response.json();
      setAccounts(data.accounts);
    } catch (err) {
      setError('Failed to load linked accounts');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: response.access_token }),
        });

        if (!res.ok) {
          throw new Error('Failed to link Google account');
        }

        setSuccess('Google account linked successfully');
        fetchLinkedAccounts();
      } catch (err) {
        setError('Failed to link Google account');
      }
    },
    onError: () => {
      setError('Google authentication failed');
    },
  });

  const handleGithubLogin = async () => {
    try {
      // Open GitHub OAuth window
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const githubWindow = window.open(
        `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=user:email`,
        'github-oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from popup
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'github-oauth') {
          githubWindow?.close();
          
          const res = await fetch('/api/auth/github', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: event.data.token }),
          });

          if (!res.ok) {
            throw new Error('Failed to link GitHub account');
          }

          setSuccess('GitHub account linked successfully');
          fetchLinkedAccounts();
        }
      });
    } catch (err) {
      setError('Failed to link GitHub account');
    }
  };

  const handleUnlinkAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/auth/unlink-account/${accountId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unlink account');
      }

      setSuccess('Account unlinked successfully');
      fetchLinkedAccounts();
    } catch (err) {
      setError('Failed to unlink account');
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <GoogleIcon />;
      case 'github':
        return <GitHubIcon />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Linked Accounts
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <List>
          {accounts.map((account) => (
            <React.Fragment key={account.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="unlink"
                    onClick={() => handleUnlinkAccount(account.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {getProviderIcon(account.provider)}
                </ListItemIcon>
                <ListItemText
                  primary={`${account.provider.charAt(0).toUpperCase() + account.provider.slice(1)} Account`}
                  secondary={account.providerAccountId}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => handleGoogleLogin()}
            disabled={accounts.some((acc) => acc.provider === 'google')}
          >
            Link Google Account
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={handleGithubLogin}
            disabled={accounts.some((acc) => acc.provider === 'github')}
          >
            Link GitHub Account
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 