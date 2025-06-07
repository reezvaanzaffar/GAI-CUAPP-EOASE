import React from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { PersonaDashboardLayout } from '@/components/layout/PersonaDashboardLayout';
import { LearningPath } from '@/components/learning/LearningPath';
import { ProductTracker } from '@/components/products/ProductTracker';
import {
  LearningModule,
  LearningStep,
  UserStepProgress,
  StepStatus,
  Product,
  LaunchChecklistItem,
} from '@prisma/client';

interface StepWithProgress extends LearningStep {
  progress?: UserStepProgress;
}

interface ModuleWithSteps extends LearningModule {
  steps: StepWithProgress[];
}

interface ProductWithChecklist extends Product {
  checklist: LaunchChecklistItem[];
}

interface SamDashboardProps {
  modules: ModuleWithSteps[];
  products: ProductWithChecklist[];
}

export default function SamDashboard({ modules, products }: SamDashboardProps) {
  const handleUpdateProgress = async (stepId: string, status: StepStatus) => {
    try {
      const response = await fetch('/api/learning/update-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stepId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      // Refresh the page to show updated progress
      window.location.reload();
    } catch (error) {
      console.error('Error updating progress:', error);
      // You might want to show an error toast here
    }
  };

  const handleCreateProduct = async (name: string, description: string) => {
    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateChecklist = async (itemId: string, isCompleted: boolean) => {
    try {
      const response = await fetch('/api/products/update-checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, isCompleted }),
      });

      if (!response.ok) {
        throw new Error('Failed to update checklist');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  return (
    <PersonaDashboardLayout persona="Startup Sam">
      <div className="space-y-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Your Learning Path</h2>
            <p className="text-muted-foreground">
              Follow these steps to validate your product idea and prepare for launch
            </p>
          </div>
          <LearningPath modules={modules} onUpdateProgress={handleUpdateProgress} />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Product & Launch Tracker</h2>
            <p className="text-muted-foreground">Track your products and their launch progress</p>
          </div>
          <ProductTracker
            products={products}
            onCreateProduct={handleCreateProduct}
            onUpdateChecklist={handleUpdateChecklist}
          />
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

  // Fetch modules and steps
  const modules = await prisma.learningModule.findMany({
    where: {
      persona: 'STARTUP_SAM',
    },
    include: {
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  // Fetch user progress
  const progress = await prisma.userStepProgress.findMany({
    where: {
      userId: session.user.id,
    },
  });

  // Fetch products and their checklists
  const products = await prisma.product.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      checklist: {
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Combine modules with progress
  const modulesWithProgress = modules.map(module => ({
    ...module,
    steps: module.steps.map(step => ({
      ...step,
      progress: progress.find(p => p.stepId === step.id),
    })),
  }));

  return {
    props: {
      modules: modulesWithProgress,
      products,
    },
  };
};
