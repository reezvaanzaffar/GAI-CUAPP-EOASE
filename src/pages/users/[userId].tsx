import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { User, Profile, UserPersona } from '@prisma/client';
import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

interface PublicProfileProps {
  user: User;
  profile: Profile;
}

const personaDescriptions: Record<UserPersona, string> = {
  SCALING_SARAH: 'Manages a 6-figure business',
  STARTUP_SAM: 'Currently launching their first product',
  LEARNING_LARRY: 'Focused on mastering Amazon selling',
  INVESTOR_IAN: 'Looking for investment opportunities',
  PROVIDER_PRIYA: 'Specialized Amazon service provider',
};

const personaColors: Record<UserPersona, string> = {
  SCALING_SARAH: 'bg-purple-100 text-purple-800',
  STARTUP_SAM: 'bg-blue-100 text-blue-800',
  LEARNING_LARRY: 'bg-green-100 text-green-800',
  INVESTOR_IAN: 'bg-yellow-100 text-yellow-800',
  PROVIDER_PRIYA: 'bg-pink-100 text-pink-800',
};

export default function PublicProfile({ user, profile }: PublicProfileProps) {
  const { data: session } = useSession();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const canRequestMentorship =
    session?.user?.id &&
    profile.persona === 'SCALING_SARAH' &&
    session.user.persona === 'STARTUP_SAM';

  const handleRequestMentorship = async () => {
    if (!requestMessage.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter a message explaining what you need help with.',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/mentorship/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: user.id,
          message: requestMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send mentorship request');
      }

      setMessage({
        type: 'success',
        text: 'Mentorship request sent successfully!',
      });
      setIsRequestModalOpen(false);
      setRequestMessage('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send mentorship request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {message && (
        <div
          className={`mb-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center space-x-4">
            {profile.avatarUrl ? (
              <div className="relative h-20 w-20 rounded-full overflow-hidden">
                <Image
                  src={profile.avatarUrl}
                  alt={user.name || 'Profile picture'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {profile.headline && <p className="text-lg text-gray-600">{profile.headline}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-6">
            <div>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${personaColors[profile.persona]}`}
              >
                {profile.persona.replace('_', ' ')}
              </span>
              <p className="mt-2 text-sm text-gray-600">{personaDescriptions[profile.persona]}</p>
            </div>

            {profile.bio && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">About</h3>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {canRequestMentorship && (
              <div className="mt-6">
                <Button onClick={() => setIsRequestModalOpen(true)}>Request Mentorship</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Mentorship"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Explain what you need help with and why you&apos;d like to connect with this mentor.
          </p>
          <textarea
            value={requestMessage}
            onChange={e => setRequestMessage(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
            placeholder="I need help with..."
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestMentorship} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </div>
      </Modal>

      <Typography>You&apos;re viewing this user&apos;s profile.</Typography>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const userId = params?.userId as string;

  if (!userId) {
    return {
      notFound: true,
    };
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  if (!profile || !profile.isPublic) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(profile.user)),
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
};
