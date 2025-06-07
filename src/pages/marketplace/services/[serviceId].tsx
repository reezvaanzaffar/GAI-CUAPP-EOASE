import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Service, User } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface ServiceWithProvider extends Service {
  provider: User;
}

interface ServicePageProps {
  service: ServiceWithProvider;
}

export default function ServicePage({ service }: ServicePageProps) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/services/inquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          message: inquiryMessage,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setMessage({
        type: 'success',
        text: 'Inquiry submitted successfully',
      });

      setIsInquiryModalOpen(false);
      setInquiryMessage('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to submit inquiry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {message && (
          <div
            className={`mb-8 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              {service.provider.image ? (
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <Image
                    src={service.provider.image}
                    alt={service.provider.name || 'Provider'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {service.provider.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{service.provider.name}</h2>
                <p className="text-gray-500">{service.category}</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">{service.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">${service.price.toFixed(2)}</span>
              <Button onClick={() => setIsInquiryModalOpen(true)}>Contact Provider</Button>
            </div>
          </div>
        </div>

        {/* Inquiry Modal */}
        <Modal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          title="Contact Provider"
        >
          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                id="message"
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tell the provider about your needs..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setIsInquiryModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
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

  const serviceId = context.params?.serviceId as string;

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
    include: {
      provider: true,
    },
  });

  if (!service || service.status !== 'PUBLISHED') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service: JSON.parse(JSON.stringify(service)),
    },
  };
};
