"use client";
import { useSession } from 'next-auth/react';
import React from 'react';
import ConsolidatedLeadManagementDashboard from '@/backup/src/components/dashboard/ConsolidatedLeadManagementDashboard';

const ALLOWED_ROLES = ['sales', 'bdr', 'marketing'];

export default function SalesDashboardPage() {
  const { data: session, status } = useSession();
  if (status === 'loading') return <div>Loading...</div>;
  if (!session || !session.user || !ALLOWED_ROLES.includes(session.user.role)) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>Access Denied: You do not have permission to view this page.</div>;
  }
  return <ConsolidatedLeadManagementDashboard userRole={session.user.role} accessLevel={session.user.accessLevel || ''} />;
} 