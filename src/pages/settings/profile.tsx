import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Profile } from '@prisma/client';

interface ProfileSettingsProps {
  profile: Profile;
}

export default function ProfileSettings({ profile }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    headline: profile.headline || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl || '',
    isPublic: profile.isPublic,
    isSeekingInvestment: profile.isSeekingInvestment,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PersonaDashboardLayout persona={profile.persona}>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <p className="text-muted-foreground">
            Customize how other members see you in the community
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                Headline
              </label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                placeholder="A short, one-line bio"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={4}
              />
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                Profile Picture URL
              </label>
              <Input
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                Make my profile public
              </label>
            </div>

            {profile.persona === 'SCALING_SARAH' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isSeekingInvestment"
                  checked={formData.isSeekingInvestment}
                  onChange={e =>
                    setFormData({ ...formData, isSeekingInvestment: e.target.checked })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isSeekingInvestment" className="ml-2 block text-sm text-gray-900">
                  I am open to investment opportunities
                </label>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </PersonaDashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
};
