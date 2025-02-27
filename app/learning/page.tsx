"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningPhases } from "@/components/learning/phases/LearningPhases";
import { ProgressDashboard } from "@/components/learning/tracking/ProgressDashboard";
import { EnhancedPromptPlayground } from "@/components/learning/prompt/EnhancedPromptPlayground";
import { ROICalculator } from "@/components/implementation/ROICalculator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowRight, Award, TrendingUp, Zap } from "lucide-react";
import { useUserProgress } from "@/lib/contexts/UserProgressProvider";

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState("learning");
  
  // Get create project function from context
  const { createProject } = useUserProgress();
  
  // Handle joining implementation challenge
  const handleJoinChallenge = () => {
    createProject();
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Main Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="learning" className="px-8">Learning Path</TabsTrigger>
          <TabsTrigger value="dashboard" className="px-8">Your Progress</TabsTrigger>
          <TabsTrigger value="playground" className="px-8">Prompt Playground</TabsTrigger>
          <TabsTrigger value="implementation" className="px-8">Implementation</TabsTrigger>
        </TabsList>
        
        {/* Learning Path Content */}
        <TabsContent value="learning" className="mt-6">
          <div className="space-y-16">
            <LearningPhases />
            
            {/* Featured Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <FeaturedCard 
                title="AI Fundamentals Workshop"
                description="Join our interactive workshop to master the basics of AI and prompt engineering."
                icon={<BookOpen className="h-6 w-6 text-primary" />}
                actionText="Register Now"
              />
              <FeaturedCard 
                title="Ethics Certification"
                description="Earn your certification in AI ethics and responsible implementation."
                icon={<Award className="h-6 w-6 text-primary" />}
                actionText="Start Certification"
              />
              <FeaturedCard 
                title="Implementation Challenge"
                description="Put your skills to the test with our 5-day implementation challenge."
                icon={<TrendingUp className="h-6 w-6 text-primary" />}
                actionText="Join Challenge"
                onClick={handleJoinChallenge}
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Dashboard Content */}
        <TabsContent value="dashboard" className="mt-6">
          <ProgressDashboard />
        </TabsContent>
        
        {/* Prompt Playground Content */}
        <TabsContent value="playground" className="mt-6">
          <EnhancedPromptPlayground />
        </TabsContent>
        
        {/* Implementation Content */}
        <TabsContent value="implementation" className="mt-6">
          <ROICalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Featured content card component
function FeaturedCard({ 
  title, 
  description, 
  icon, 
  actionText,
  onClick
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  actionText: string;
  onClick?: () => void;
}) {
  return (
    <Card className="p-6 bg-card/50 border-0 shadow-md">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Button className="mt-6 w-full" variant="outline" onClick={onClick}>
          {actionText}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
} 