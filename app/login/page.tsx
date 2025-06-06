'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { signIn } from 'next-auth/react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <LoginForm />
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            sx={{ mb: 2 }}
          >
            CONTINUE WITH GITHUB
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={() => signIn('facebook', { callbackUrl: '/dashboard' })}
            sx={{ mb: 2 }}
          >
            CONTINUE WITH FACEBOOK
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            sx={{ mb: 2 }}
          >
            CONTINUE WITH GOOGLE
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LinkedInIcon />}
            onClick={() => signIn('linkedin', { callbackUrl: '/dashboard' })}
            sx={{ mb: 2 }}
          >
            CONTINUE WITH LINKEDIN
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<TwitterIcon />}
            onClick={() => signIn('twitter', { callbackUrl: '/dashboard' })}
            sx={{ mb: 2 }}
          >
            CONTINUE WITH TWITTER
          </Button>
        </Paper>
      </Box>
    </Container>
  );
} 