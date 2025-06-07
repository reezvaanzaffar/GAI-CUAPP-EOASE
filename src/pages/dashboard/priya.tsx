import React from 'react';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';

export default function PriyaDashboard() {
  return (
    <PersonaDashboardLayout persona="Provider Priya">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Add your services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Track your clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0.0</p>
            <p className="text-sm text-muted-foreground">Average rating</p>
          </CardContent>
        </Card>
      </div>
    </PersonaDashboardLayout>
  );
}
