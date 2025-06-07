import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.persona) {
      router.push('/onboarding/select-persona');
      return;
    }

    // Redirect to persona-specific dashboard
    const personaPath = session.user.persona.toLowerCase().split('_')[1];
    router.push(`/dashboard/${personaPath}`);
  }, [session, status, router]);

  // Show loading state while checking session and redirecting
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </AppLayout>
  );
}
