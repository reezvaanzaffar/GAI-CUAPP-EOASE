'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import LinkedAccounts from '@/components/auth/LinkedAccounts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AccountSettingsPage() {
  const { user, updateProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    title: user?.title || '',
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    productUpdates: true,
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginNotifications: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateProfile(profileData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (setting: string) => {
    setNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));

    try {
      // TODO: Implement notification preference update
      setSuccess('Notification preferences updated');
    } catch (err) {
      setError('Failed to update notification preferences');
    }
  };

  const handleSecurityChange = async (setting: string) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));

    try {
      // TODO: Implement security setting update
      setSuccess('Security settings updated');
    } catch (err) {
      setError('Failed to update security settings');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>

      <Paper sx={{ mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="account settings tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" />
          <Tab label="Linked Accounts" />
          <Tab label="Notifications" />
          <Tab label="Security" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ m: 2 }}>
            {success}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleProfileUpdate}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={profileData.company}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={profileData.title}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <LinkedAccounts />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.marketingEmails}
                  onChange={() => handleNotificationChange('marketingEmails')}
                />
              }
              label="Marketing Emails"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.securityAlerts}
                  onChange={() => handleNotificationChange('securityAlerts')}
                />
              }
              label="Security Alerts"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.productUpdates}
                  onChange={() => handleNotificationChange('productUpdates')}
                />
              }
              label="Product Updates"
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Security Settings
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onChange={() => handleSecurityChange('twoFactorEnabled')}
                />
              }
              label="Two-Factor Authentication"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={securitySettings.loginNotifications}
                  onChange={() => handleSecurityChange('loginNotifications')}
                />
              }
              label="Login Notifications"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Session Timeout (minutes)
            </Typography>
            <TextField
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value),
                }))
              }
              inputProps={{ min: 5, max: 120 }}
              sx={{ width: 100 }}
            />
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
} 