import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import LinkedAccounts from '@/components/auth/LinkedAccounts';

export default function SettingsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <LinkedAccounts />
        </Paper>
      </Box>
    </Container>
  );
} 