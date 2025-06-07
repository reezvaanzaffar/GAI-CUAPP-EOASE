import React from 'react';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';

export default function LarryDashboard() {
  return (
    <PersonaDashboardLayout persona="Learning Larry">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Courses Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Start learning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Acquired</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Track your progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </div>
    </PersonaDashboardLayout>
  );
}
