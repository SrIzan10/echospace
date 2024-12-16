"use client"

import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  html: ReactNode;
}

export default function LandingStepper({ steps }: { steps: Step[] }) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        <div className="w-full lg:w-1/2 space-y-8">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 ${
                  index === currentStep ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          {steps[currentStep].html}
        </div>
      </div>
    </div>
  );
}
