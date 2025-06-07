import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Service, ServiceCategory, ServiceInquiry, User } from '@prisma/client';
import { useRouter } from 'next/router';

interface ServiceWithProvider extends Service {
  provider: User;
}

interface ServiceInquiryWithUsers extends ServiceInquiry {
  service: Service;
  inquiringUser: User;
}

interface ProviderServicesProps {
  services: ServiceWithProvider[];
  inquiries: ServiceInquiryWithUsers[];
}

export default function ProviderServices({ services, inquiries }: ProviderServicesProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: ServiceCategory.PPC_MANAGEMENT,
  });

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/services/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create service');
      }

      setMessage({
        type: 'success',
        text: 'Service created successfully',
      });

      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: ServiceCategory.PPC_MANAGEMENT,
      });

      // Refresh the page to show the new service
      router.reload();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to create service. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishService = async (serviceId: string) => {
    try {
      const res = await fetch('/api/services/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId }),
      });

      if (!res.ok) {
        throw new Error('Failed to publish service');
      }

      setMessage({
        type: 'success',
        text: 'Service published successfully',
      });

      // Refresh the page to show updated status
      router.reload();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to publish service. Please try again.',
      });
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, status: 'CONTACTED' | 'CLOSED') => {
    try {
      const res = await fetch('/api/services/inquiry/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inquiryId, status }),
      });

      if (!res.ok) {
        throw new Error('Failed to update inquiry status');
      }

      setMessage({
        type: 'success',
        text: 'Inquiry status updated successfully',
      });

      // Refresh the page to show updated status
      router.reload();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update inquiry status. Please try again.',
      });
    }
  };

  return (
    <PersonaDashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create New Service</Button>
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

        {/* Services List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <div key={service.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{service.category}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-600">{service.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">
                      ${service.price.toFixed(2)}
                    </span>
                    {service.status === 'DRAFT' && (
                      <Button onClick={() => handlePublishService(service.id)} variant="outline">
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiries List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Received Inquiries</h2>
          <div className="space-y-4">
            {inquiries.map(inquiry => (
              <div key={inquiry.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Inquiry for {inquiry.service.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        From: {inquiry.inquiringUser.name}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        inquiry.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : inquiry.status === 'CONTACTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-600">{inquiry.message}</p>
                  {inquiry.status === 'PENDING' && (
                    <div className="mt-4 flex space-x-4">
                      <Button
                        onClick={() => handleUpdateInquiryStatus(inquiry.id, 'CONTACTED')}
                        variant="outline"
                      >
                        Mark as Contacted
                      </Button>
                      <Button
                        onClick={() => handleUpdateInquiryStatus(inquiry.id, 'CLOSED')}
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        Close Inquiry
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Service Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Service"
        >
          <form onSubmit={handleCreateService} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={e =>
                  setFormData({ ...formData, category: e.target.value as ServiceCategory })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                {Object.values(ServiceCategory).map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Service'}
              </Button>
            </div>
          </form>
        </Modal>
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

  // Verify user is a provider
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user || user.profile?.persona !== 'PROVIDER_PRIYA') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const [services, inquiries] = await Promise.all([
    prisma.service.findMany({
      where: {
        providerId: session.user.id,
      },
      include: {
        provider: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.serviceInquiry.findMany({
      where: {
        service: {
          providerId: session.user.id,
        },
      },
      include: {
        service: true,
        inquiringUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return {
    props: {
      services: JSON.parse(JSON.stringify(services)),
      inquiries: JSON.parse(JSON.stringify(inquiries)),
    },
  };
};
