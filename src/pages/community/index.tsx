import React from 'react';
import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { User, Profile, UserPersona } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';

interface CommunityMember {
  user: User;
  profile: Profile;
}

interface CommunityPageProps {
  members: CommunityMember[];
}

const personaColors: Record<UserPersona, string> = {
  SCALING_SARAH: 'bg-purple-100 text-purple-800',
  STARTUP_SAM: 'bg-blue-100 text-blue-800',
  LEARNING_LARRY: 'bg-green-100 text-green-800',
  INVESTOR_IAN: 'bg-yellow-100 text-yellow-800',
  PROVIDER_PRIYA: 'bg-pink-100 text-pink-800',
};

export default function CommunityPage({ members }: CommunityPageProps) {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Community Members</h1>
        <p className="mt-4 text-lg text-gray-600">
          Connect with other Amazon sellers and service providers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map(({ user, profile }) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                {profile.avatarUrl ? (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={profile.avatarUrl}
                      alt={user.name || 'Profile picture'}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl text-gray-500">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{user.name}</h2>
                  {profile.headline && <p className="text-sm text-gray-600">{profile.headline}</p>}
                </div>
              </div>

              <div className="mt-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${personaColors[profile.persona]}`}
                >
                  {profile.persona.replace('_', ' ')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const profiles = await prisma.profile.findMany({
    where: {
      isPublic: true,
    },
    include: {
      user: true,
    },
    orderBy: {
      user: {
        name: 'asc',
      },
    },
  });

  return {
    props: {
      members: JSON.parse(JSON.stringify(profiles)),
    },
  };
};
