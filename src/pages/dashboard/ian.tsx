import React from 'react';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';

export default function IanDashboard() {
  return (
    <PersonaDashboardLayout persona="Investor Ian">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$0</p>
            <p className="text-sm text-muted-foreground">Track your investments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0%</p>
            <p className="text-sm text-muted-foreground">Average return</p>
          </CardContent>
        </Card>
      </div>
    </PersonaDashboardLayout>
  );
}
