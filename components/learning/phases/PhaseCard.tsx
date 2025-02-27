"use client";

import React from "react";
import { TextureCard } from "@/components/agent/texture-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Module = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
};

interface PhaseCardProps {
  phase: string;
  phaseNumber: string;
  title: string;
  description: string;
  accentColor: string;
  modules: Module[];
  completedModules: number;
  totalModules: number;
  icon: React.ReactNode;
  className?: string;
  onModuleClick?: (moduleId: string) => void;
}

export function PhaseCard({
  phase,
  phaseNumber,
  title,
  description,
  accentColor,
  modules,
  completedModules,
  totalModules,
  icon,
  className,
  onModuleClick,
}: PhaseCardProps) {
  const progressPercentage = (completedModules / totalModules) * 100;

  return (
    <TextureCard className={cn("h-full flex flex-col", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${accentColor}/10`}>
            <span className="text-sm font-semibold">{phaseNumber}</span>
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <Badge variant="outline" className="bg-background/20">
          {phase}
        </Badge>
      </div>
      
      <p className="text-muted-foreground text-sm mb-6">{description}</p>
      
      <div className="flex flex-col gap-3 mb-4">
        {modules.map((module) => (
          <ModuleItem 
            key={module.id} 
            id={module.id}
            title={module.title} 
            duration={module.duration}
            completed={module.completed}
            onClick={onModuleClick}
          />
        ))}
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">
            {completedModules}/{totalModules}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </TextureCard>
  );
}

function ModuleItem({ 
  id,
  title, 
  duration, 
  completed,
  onClick
}: { 
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  onClick?: (moduleId: string) => void;
}) {
  const handleClick = () => {
    if (onClick && !completed) {
      onClick(id);
    }
  };

  return (
    <div 
      className={cn(
        "bg-card/20 p-3 rounded-md flex justify-between items-center",
        !completed && onClick && "cursor-pointer hover:bg-card/30 transition-colors"
      )}
      onClick={handleClick}
    >
      <span className="font-medium text-sm">{title}</span>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
          {duration}
        </Badge>
        {completed && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 text-green-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </div>
    </div>
  );
} 