import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { MentorshipRequest, User, Profile } from '@prisma/client';

interface MentorshipRequestWithUsers extends MentorshipRequest {
  mentor: User & { profile: Profile };
  mentee: User & { profile: Profile };
}

interface MentorshipDashboardProps {
  receivedRequests: MentorshipRequestWithUsers[];
  sentRequests: MentorshipRequestWithUsers[];
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
};

export default function MentorshipDashboard({
  receivedRequests,
  sentRequests,
}: MentorshipDashboardProps) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRespond = async (requestId: string, response: 'ACCEPTED' | 'DECLINED') => {
    try {
      const res = await fetch('/api/mentorship/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          response,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to respond to request');
      }

      setMessage({
        type: 'success',
        text: `Request ${response.toLowerCase()} successfully`,
      });

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to respond to request. Please try again.',
      });
    }
  };

  return (
    <PersonaDashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Mentorship Dashboard</h1>
          <p className="mt-4 text-lg text-gray-600">
            Manage your mentorship requests and connections
          </p>
        </div>

        {message && (
          <div
            className={`mb-8 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-12">
          {/* Received Requests Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Received Requests</h2>
            {receivedRequests.length === 0 ? (
              <p className="text-gray-500">No pending mentorship requests</p>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map(request => (
                  <div key={request.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        {request.mentee.profile.avatarUrl ? (
                          <div className="relative h-12 w-12 rounded-full overflow-hidden">
                            <Image
                              src={request.mentee.profile.avatarUrl}
                              alt={request.mentee.name || 'Profile picture'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-lg text-gray-500">
                              {request.mentee.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.mentee.name}
                          </h3>
                          <p className="text-sm text-gray-500">{request.mentee.profile.headline}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-600">{request.message}</p>
                      </div>

                      {request.status === 'PENDING' && (
                        <div className="mt-6 flex space-x-4">
                          <Button
                            onClick={() => handleRespond(request.id, 'ACCEPTED')}
                            variant="outline"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRespond(request.id, 'DECLINED')}
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            Decline
                          </Button>
                        </div>
                      )}

                      <div className="mt-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sent Requests Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sent Requests</h2>
            {sentRequests.length === 0 ? (
              <p className="text-gray-500">No sent mentorship requests</p>
            ) : (
              <div className="space-y-4">
                {sentRequests.map(request => (
                  <div key={request.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        {request.mentor.profile.avatarUrl ? (
                          <div className="relative h-12 w-12 rounded-full overflow-hidden">
                            <Image
                              src={request.mentor.profile.avatarUrl}
                              alt={request.mentor.name || 'Profile picture'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-lg text-gray-500">
                              {request.mentor.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.mentor.name}
                          </h3>
                          <p className="text-sm text-gray-500">{request.mentor.profile.headline}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-gray-600">{request.message}</p>
                      </div>

                      <div className="mt-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}
                        >
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

  const [receivedRequests, sentRequests] = await Promise.all([
    prisma.mentorshipRequest.findMany({
      where: {
        mentorId: session.user.id,
      },
      include: {
        mentor: {
          include: {
            profile: true,
          },
        },
        mentee: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.mentorshipRequest.findMany({
      where: {
        menteeId: session.user.id,
      },
      include: {
        mentor: {
          include: {
            profile: true,
          },
        },
        mentee: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    props: {
      receivedRequests: JSON.parse(JSON.stringify(receivedRequests)),
      sentRequests: JSON.parse(JSON.stringify(sentRequests)),
    },
  };
};
