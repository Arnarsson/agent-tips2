"use client";

import React from "react";
import { PhaseCard } from "./PhaseCard";
import { GradientHeading } from "@/components/agent/gradient-heading";
import { Book, ShieldCheck, Rocket } from "lucide-react";
import { useUserProgress } from "@/lib/contexts/UserProgressProvider";

// Sample data - in production, this would come from your data store
const fundamentalsModules = [
  { id: "ai-basics", title: "AI Basics", duration: "1.5h", completed: true },
  { id: "prompt-structure", title: "Prompt Structure", duration: "2h", completed: false },
  { id: "best-practices", title: "Best Practices", duration: "1h", completed: false },
];

const ethicsModules = [
  { id: "bias-detection", title: "Bias Detection", duration: "2h", completed: false },
  { id: "ethical-guidelines", title: "Ethical Guidelines", duration: "1.5h", completed: false },
  { id: "governance-framework", title: "Governance Framework", duration: "3h", completed: false },
];

const implementationModules = [
  { id: "use-case-planning", title: "Use Case Planning", duration: "2h", completed: false },
  { id: "integration-strategy", title: "Integration Strategy", duration: "3h", completed: false },
  { id: "roi-measurement", title: "ROI Measurement", duration: "2h", completed: false },
];

export function LearningPhases() {
  // Get phase data from the user progress context
  const { 
    fundamentalsProgress, 
    ethicsProgress, 
    implementationProgress,
    markModuleAsCompleted
  } = useUserProgress();

  // Handle clicking on a module to mark it as completed
  const handleModuleClick = (moduleId: string) => {
    markModuleAsCompleted(moduleId);
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-12">
        <GradientHeading level={2} className="mb-4">
          Our Three-Phase Methodology
        </GradientHeading>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A proven approach to AI implementation success, guiding you from foundational knowledge 
          to ethical considerations and practical business applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PhaseCard
          phase="PHASE 1"
          phaseNumber="1"
          title="Fundamentals"
          description="Establish a solid foundation in prompt engineering principles, understanding AI capabilities and limitations."
          accentColor="blue-500"
          modules={fundamentalsProgress.modules}
          completedModules={fundamentalsProgress.completedModules}
          totalModules={fundamentalsProgress.totalModules}
          icon={<Book className="h-5 w-5" />}
          onModuleClick={handleModuleClick}
        />

        <PhaseCard
          phase="PHASE 2"
          phaseNumber="2"
          title="Ethics"
          description="Develop an ethical framework for responsible AI usage, addressing bias, transparency, and governance."
          accentColor="purple-500"
          modules={ethicsProgress.modules}
          completedModules={ethicsProgress.completedModules}
          totalModules={ethicsProgress.totalModules}
          icon={<ShieldCheck className="h-5 w-5" />}
          onModuleClick={handleModuleClick}
        />

        <PhaseCard
          phase="PHASE 3"
          phaseNumber="3"
          title="Implementation"
          description="Apply learnings to real-world business challenges with practical tools and ROI measurement."
          accentColor="green-500"
          modules={implementationProgress.modules}
          completedModules={implementationProgress.completedModules}
          totalModules={implementationProgress.totalModules}
          icon={<Rocket className="h-5 w-5" />}
          onModuleClick={handleModuleClick}
        />
      </div>
    </div>
  );
} 