import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { LearningModule, LearningStep, UserStepProgress, StepStatus } from '@prisma/client';
import { StepDetailModal } from './StepDetailModal';

interface StepWithProgress extends LearningStep {
  progress?: UserStepProgress;
}

interface ModuleWithSteps extends LearningModule {
  steps: StepWithProgress[];
}

interface LearningPathProps {
  modules: ModuleWithSteps[];
  onUpdateProgress: (stepId: string, status: StepStatus) => Promise<void>;
}

export const LearningPath: React.FC<LearningPathProps> = ({ modules, onUpdateProgress }) => {
  const [selectedStep, setSelectedStep] = useState<StepWithProgress | null>(null);

  const getStatusIcon = (status?: StepStatus) => {
    switch (status) {
      case StepStatus.COMPLETED:
        return '✅';
      case StepStatus.IN_PROGRESS:
        return '🔄';
      default:
        return '⭕';
    }
  };

    switch (currentStatus) {
      case StepStatus.NOT_STARTED:
        return StepStatus.IN_PROGRESS;
      case StepStatus.IN_PROGRESS:
        return StepStatus.COMPLETED;
      case StepStatus.COMPLETED:
        return StepStatus.NOT_STARTED;
      default:
        return StepStatus.NOT_STARTED;
    }
  };

  return (
    <div className="space-y-8">
      {modules.map(module => (
        <Card key={module.id} className="overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle>{module.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {module.steps.map(step => (
                <div
                  key={step.id}
                  className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedStep(step)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">{getStatusIcon(step.progress?.status)}</span>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.progress?.status || 'Not Started'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedStep && (
        <StepDetailModal
          step={selectedStep}
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
          onUpdateProgress={onUpdateProgress}
        />
      )}
    </div>
  );
};
