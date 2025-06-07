import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPersona } from '@prisma/client';

const personas = [
  {
    id: UserPersona.SCALING_SARAH,
    name: 'Scaling Sarah',
    description: '1-3 years selling experience, $15k-$50k monthly revenue',
    color: 'bg-blue-50',
  },
  {
    id: UserPersona.STARTUP_SAM,
    name: 'Startup Sam',
    description: 'Pre-launch to first 3 months, $5k-$15k capital',
    color: 'bg-green-50',
  },
  {
    id: UserPersona.LEARNING_LARRY,
    name: 'Learning Larry',
    description: 'Research phase, focused on comprehensive understanding',
    color: 'bg-purple-50',
  },
  {
    id: UserPersona.INVESTOR_IAN,
    name: 'Investor Ian',
    description: '$50k-$500k investment capacity',
    color: 'bg-yellow-50',
  },
  {
    id: UserPersona.PROVIDER_PRIYA,
    name: 'Provider Priya',
    description: 'Specialized Amazon service provider',
    color: 'bg-pink-50',
  },
];

export default function SelectPersona() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleSelectPersona = async (persona: UserPersona) => {
    setIsLoading(persona);
    try {
      const response = await fetch('/api/user/select-persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
      });

      if (!response.ok) {
        throw new Error('Failed to select persona');
      }

      // Redirect to persona-specific dashboard
      const personaPath = persona.toLowerCase().split('_')[1];
      router.push(`/dashboard/${personaPath}`);
    } catch (error) {
      console.error('Error selecting persona:', error);
      // Handle error (you might want to show a toast notification here)
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Select Your Persona</h1>
          <p className="text-muted-foreground">
            Choose the persona that best describes your current situation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {personas.map(persona => (
            <Card key={persona.id} className={`${persona.color} transition-all hover:shadow-lg`}>
              <CardHeader>
                <h2 className="text-xl font-semibold">{persona.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{persona.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSelectPersona(persona.id)}
                  isLoading={isLoading === persona.id}
                >
                  Select {persona.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
