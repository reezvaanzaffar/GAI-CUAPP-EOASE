'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, LinearProgress, TextField, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, Divider, Paper, Avatar, Stack, IconButton, Menu
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StarIcon from '@mui/icons-material/Star';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const onboardingSteps = [
  'Watch Welcome Video',
  'Take Client Portal Tour',
  'Complete Initial Assessment',
  'Define Your Goals',
  'Setup Communication Preferences',
  'Review Launch Program Agreement',
  'Upload Initial Business Documents',
  'Schedule Intro Call with Launch Coach',
];

const requiredDocuments = [
  { label: 'ID Verification', type: 'Government ID' },
  { label: 'Address Proof', type: 'Utility Bill / Bank Statement' },
  { label: 'Business Registration (Optional)', type: 'Business License/Certificate' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [goal, setGoal] = useState<string>('');
  const [goalCategory, setGoalCategory] = useState<string>('Financial');
  const [goals, setGoals] = useState<{ description: string; category: string }[]>([]);
  const [documents, setDocuments] = useState<Record<number, string>>({});
  const [contactMethod, setContactMethod] = useState('Email');
  const [meetingFrequency, setMeetingFrequency] = useState('Weekly');
  const [notificationPrefs, setNotificationPrefs] = useState({
    newTasks: true,
    milestone: true,
    document: true,
    community: true,
  });
  const [meetingTimes, setMeetingTimes] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Client-side role-based redirect
  React.useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) return;
    if (session.user.role === 'sales') {
      router.replace('/sales/dashboard');
    }
  }, [session, status, router]);

  const handleStepComplete = (idx: number) => {
    setCompletedSteps((prev) => prev.includes(idx) ? prev : [...prev, idx]);
  };

  const handleAddGoal = () => {
    if (goal) {
      setGoals([...goals, { description: goal, category: goalCategory }]);
      setGoal('');
      setGoalCategory('Financial');
    }
  };

  const handleDocUpload = (idx: number, file: File | undefined) => {
    setDocuments((prev) => ({ ...prev, [idx]: file?.name || 'Uploaded' }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1200, mx: 'auto', bgcolor: '#181C24', minHeight: '100vh' }}>
      {/* Header with Profile Menu */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {session?.user && (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar alt={session.user.name || 'User'} src={session.user.image || undefined} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} onClick={handleMenuClose} sx={{ mt: 1 }}>
              <MenuItem disabled>
                {session.user.name || 'Account'}
              </MenuItem>
              <MenuItem onClick={() => { router.push('/account/settings'); handleMenuClose(); }}>Account Settings</MenuItem>
              <MenuItem onClick={() => signOut()}>Log Out</MenuItem>
            </Menu>
          </>
        )}
      </Box>
      {/* Welcome & Onboarding */}
      <Paper elevation={3} sx={{ p: 4, mb: 5, bgcolor: '#232837', color: '#fff', borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#fff' }}>
          {`Welcome to Your Success Portal, ${session?.user?.name || 'Valued Client'}!`}
        </Typography>
        <Typography gutterBottom sx={{ color: '#b0b8c1' }}>
          This portal is your central hub for everything related to your program. Let's get you started on the path to achieving your Amazon goals.
        </Typography>
        <Box sx={{ my: 3, background: '#232837', borderRadius: 2, p: 4, textAlign: 'center', color: '#aaa', border: '1px solid #2c3142' }}>
          <Typography variant="h6" gutterBottom>
            Personalized Welcome Video from [Founder Name]
          </Typography>
          <Box sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#181C24', borderRadius: 2, border: '1px dashed #444' }}>
            <span>Video player placeholder</span>
          </Box>
        </Box>
        <Typography sx={{ mb: 2, color: '#b0b8c1' }}>
          Please complete the onboarding steps below to unlock the full potential of your program and tailor your experience.
        </Typography>
        {/* Onboarding Steps */}
        <Card elevation={2} sx={{ mb: 4, bgcolor: '#232837', color: '#fff', borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Your Onboarding Journey</Typography>
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={completedSteps.length / onboardingSteps.length * 100} sx={{ height: 12, borderRadius: 6, bgcolor: '#232837', '& .MuiLinearProgress-bar': { bgcolor: '#4f8cff' } }} />
              <Typography variant="body2" color="#b0b8c1" sx={{ mt: 1 }}>
                Progress: {completedSteps.length} / {onboardingSteps.length} Steps
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {onboardingSteps.map((step, idx) => (
                <Grid item xs={12} md={6} key={step}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, bgcolor: completedSteps.includes(idx) ? '#26304a' : 'transparent', transition: 'background 0.2s' }}>
                    <Checkbox checked={completedSteps.includes(idx)} onChange={() => handleStepComplete(idx)} icon={<AssignmentTurnedInIcon />} checkedIcon={<CheckCircleIcon sx={{ color: '#4f8cff' }} />} />
                    <Typography sx={{ color: completedSteps.includes(idx) ? '#4f8cff' : '#fff' }}>{step}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Paper>

      <Divider sx={{ my: 4, borderColor: '#2c3142' }} />

      {/* Program Goals */}
      <Paper elevation={3} sx={{ p: 4, mb: 5, bgcolor: '#232837', color: '#fff', borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Your Program Goals</Typography>
        <Typography variant="body2" color="#b0b8c1" sx={{ mb: 2 }}>
          Define what success looks like for you. Clear goals will help us tailor your experience and track your progress.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Goal Description"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            sx={{ minWidth: 250, bgcolor: '#20232e', input: { color: '#fff' }, label: { color: '#b0b8c1' } }}
            InputLabelProps={{ style: { color: '#b0b8c1' } }}
          />
          <FormControl sx={{ minWidth: 180, bgcolor: '#20232e' }}>
            <InputLabel sx={{ color: '#b0b8c1' }}>Category</InputLabel>
            <Select value={goalCategory} label="Category" onChange={e => setGoalCategory(e.target.value)} sx={{ color: '#fff' }}>
              <MenuItem value="Financial">Financial</MenuItem>
              <MenuItem value="Operational">Operational</MenuItem>
              <MenuItem value="Learning">Learning</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleAddGoal} sx={{ minWidth: 120, bgcolor: '#4f8cff', color: '#fff', '&:hover': { bgcolor: '#3574e6' } }}>Add Goal</Button>
        </Box>
        {goals.length === 0 ? (
          <Typography color="#b0b8c1">No goals set yet. Add your first goal above!</Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {goals.map((g, i) => (
              <Paper key={i} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#20232e', color: '#fff', borderRadius: 2 }}>
                <span>{g.description} <span style={{ color: '#b0b8c1', fontSize: 13 }}>({g.category})</span></span>
                <StarIcon sx={{ color: '#FFD700' }} />
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      <Divider sx={{ my: 4, borderColor: '#2c3142' }} />

      {/* Required Documents */}
      <Paper elevation={3} sx={{ p: 4, mb: 5, bgcolor: '#232837', color: '#fff', borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Required Documents</Typography>
        <Typography variant="body2" color="#b0b8c1" sx={{ mb: 2 }}>
          Please upload the following documents to complete your profile and unlock all program features. All documents are stored securely.
        </Typography>
        <Grid container spacing={3}>
          {requiredDocuments.map((doc, idx) => (
            <Grid item xs={12} md={4} key={doc.label}>
              <Card elevation={2} sx={{ bgcolor: '#20232e', color: '#fff', borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" gap={2} sx={{ mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#4f8cff' }}><CloudUploadIcon /></Avatar>
                    <Box>
                      <Typography fontWeight={600}>{doc.label}</Typography>
                      <Typography variant="body2" color="#b0b8c1">{doc.type}</Typography>
                    </Box>
                  </Stack>
                  <Button variant="outlined" component="label" fullWidth sx={{ color: '#4f8cff', borderColor: '#4f8cff', '&:hover': { borderColor: '#3574e6', color: '#3574e6' } }}>
                    {documents[idx] ? 'Uploaded' : 'Upload Document'}
                    <input type="file" hidden onChange={e => handleDocUpload(idx, e.target.files?.[0])} />
                  </Button>
                  {documents[idx] && <Typography variant="caption" color="success.main">{documents[idx]}</Typography>}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Divider sx={{ my: 4, borderColor: '#2c3142' }} />

      {/* Communication Preferences */}
      <Paper elevation={3} sx={{ p: 4, mb: 5, bgcolor: '#232837', color: '#fff', borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Communication Preferences</Typography>
        <Typography variant="body2" color="#b0b8c1" sx={{ mb: 2 }}>
          Help us communicate with you effectively. Set your preferences for updates, meetings, and notifications.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2, bgcolor: '#20232e' }}>
              <InputLabel sx={{ color: '#b0b8c1' }}>Primary Contact Method</InputLabel>
              <Select value={contactMethod} label="Primary Contact Method" onChange={e => setContactMethod(e.target.value)} sx={{ color: '#fff' }}>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Phone">Phone</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2, bgcolor: '#20232e' }}>
              <InputLabel sx={{ color: '#b0b8c1' }}>Preferred Meeting Frequency</InputLabel>
              <Select value={meetingFrequency} label="Preferred Meeting Frequency" onChange={e => setMeetingFrequency(e.target.value)} sx={{ color: '#fff' }}>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Biweekly">Biweekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Preferred Meeting Times (Optional)"
              value={meetingTimes}
              onChange={e => setMeetingTimes(e.target.value)}
              fullWidth
              sx={{ mb: 2, bgcolor: '#20232e', input: { color: '#fff' }, label: { color: '#b0b8c1' } }}
              InputLabelProps={{ style: { color: '#b0b8c1' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>Notification Preferences:</Typography>
            <FormControlLabel
              control={<Checkbox checked={notificationPrefs.newTasks} onChange={e => setNotificationPrefs(p => ({ ...p, newTasks: e.target.checked }))} sx={{ color: '#4f8cff' }} />}
              label={<span style={{ color: '#b0b8c1' }}>New Tasks Updates</span>}
            />
            <FormControlLabel
              control={<Checkbox checked={notificationPrefs.milestone} onChange={e => setNotificationPrefs(p => ({ ...p, milestone: e.target.checked }))} sx={{ color: '#4f8cff' }} />}
              label={<span style={{ color: '#b0b8c1' }}>Milestone Updates</span>}
            />
            <FormControlLabel
              control={<Checkbox checked={notificationPrefs.document} onChange={e => setNotificationPrefs(p => ({ ...p, document: e.target.checked }))} sx={{ color: '#4f8cff' }} />}
              label={<span style={{ color: '#b0b8c1' }}>Document Status Updates</span>}
            />
            <FormControlLabel
              control={<Checkbox checked={notificationPrefs.community} onChange={e => setNotificationPrefs(p => ({ ...p, community: e.target.checked }))} sx={{ color: '#4f8cff' }} />}
              label={<span style={{ color: '#b0b8c1' }}>Community Mentions Updates</span>}
            />
            <Button variant="contained" sx={{ mt: 2, bgcolor: '#4f8cff', color: '#fff', '&:hover': { bgcolor: '#3574e6' } }}>Save Preferences</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
} 