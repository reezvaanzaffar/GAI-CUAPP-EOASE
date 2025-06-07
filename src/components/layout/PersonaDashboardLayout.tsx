import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AppLayout } from './AppLayout';

interface PersonaDashboardLayoutProps {
  children: React.ReactNode;
  persona: string;
}

export const PersonaDashboardLayout: React.FC<PersonaDashboardLayoutProps> = ({
  children,
  persona,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  // Verify that the user has the correct persona
  React.useEffect(() => {
    if (session?.user?.persona?.toLowerCase() !== persona.toLowerCase()) {
      router.push('/dashboard');
    }
  }, [session, persona, router]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {persona}!</h1>
          <p className="text-muted-foreground">Your personalized dashboard is coming soon</p>
        </div>
        {children}
      </div>
    </AppLayout>
  );
};
