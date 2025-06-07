import React from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { AppLayout } from '@/components/layout/AppLayout';
import { Service, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface ServiceWithProvider extends Service {
  provider: User;
}

interface MarketplaceProps {
  services: ServiceWithProvider[];
}

export default function Marketplace({ services }: MarketplaceProps) {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Service Marketplace</h1>
          <p className="mt-4 text-lg text-gray-600">
            Find expert services to help grow your Amazon business
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <Link key={service.id} href={`/marketplace/services/${service.id}`} className="block">
              <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {service.provider.image ? (
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={service.provider.image}
                          alt={service.provider.name || 'Provider'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg text-gray-500">
                          {service.provider.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{service.provider.name}</h3>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h4>
                  <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">
                      ${service.price.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
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

  const services = await prisma.service.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      provider: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      services: JSON.parse(JSON.stringify(services)),
    },
  };
};
