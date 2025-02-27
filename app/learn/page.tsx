"use client";

import React, { useState, useEffect } from "react";
import LearningSections from "@/components/learn/learning-sections";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProgressTracker from "@/components/learn/progress-tracker";
import LearningRecommendations from "@/components/learn/learning-recommendations";
import PromptPlayground from "@/components/learn/prompt-playground";
import { useUserProgress } from "@/lib/contexts/UserProgressProvider";

export default function LearnPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const {
    fundamentalsProgress,
    ethicsProgress,
    implementationProgress,
    currentStreak,
    overallProgress,
    nextModule,
    markModuleAsCompleted,
    markExampleAsCompleted,
    markExerciseAsCompleted
  } = useUserProgress();

  // Calculate total examples and exercises across all phases
  const totalExamples = fundamentalsProgress.totalExamples + ethicsProgress.totalExamples + implementationProgress.totalExamples;
  const totalExercises = fundamentalsProgress.totalExercises + ethicsProgress.totalExercises + implementationProgress.totalExercises;
  const completedExamples = fundamentalsProgress.completedExamples + ethicsProgress.completedExamples + implementationProgress.completedExamples;
  const completedExercises = fundamentalsProgress.completedExercises + ethicsProgress.completedExercises + implementationProgress.completedExercises;
  
  // Use streak from user progress
  const streak = currentStreak;
  
  // Simple mock recommendations based on next module
  const recommendations = nextModule ? [{
    id: nextModule.id,
    title: nextModule.title,
    type: 'example' as 'example' | 'exercise' | 'guide',
    category: 'Recommended',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimatedTime: '10 min',
    tags: ['recommended', 'next-module'],
    reason: 'Continue where you left off'
  }] : [];

  // Handle scroll progress for reading indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Handle recommendation selection
  const handleSelectRecommendation = (id: string) => {
    // In a real app, this would navigate to the specific content
    console.log(`Selected recommendation: ${id}`);
    
    // For demo purposes, let's mark it as completed
    if (id.includes("fundamentals")) {
      markExampleAsCompleted("fundamentals");
    } else if (id.includes("ethics")) {
      markExampleAsCompleted("ethics");
    } else if (id.includes("implementation")) {
      markExampleAsCompleted("implementation");
    }
  };

  return (
    <>
      {/* Reading progress indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <div className="container py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span>Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/learn" className="flex items-center font-medium">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Learn</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <motion.div 
          className="text-center space-y-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          ref={ref}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight"
            variants={itemVariants}
          >
            Prompt Engineering Academy
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Master the art and science of crafting effective prompts for AI models
          </motion.p>
          <motion.div 
            className="h-1 w-20 bg-primary mx-auto mt-4"
            variants={itemVariants}
          />
        </motion.div>
        
        {/* Progress and Recommendations Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProgressTracker 
            totalExamples={totalExamples}
            totalExercises={totalExercises}
            completedExamples={completedExamples}
            completedExercises={completedExercises}
            streak={streak}
          />
          
          <LearningRecommendations 
            recommendations={recommendations}
            onSelectRecommendation={handleSelectRecommendation}
          />
        </div>
        
        {/* Prompt Playground Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Interactive Prompt Playground
            </h2>
          </div>
          <PromptPlayground 
            onSavePrompt={(prompt) => {
              console.log("Saved prompt:", prompt);
              // In a real app, you might save this to user's saved prompts
            }}
          />
        </motion.div>

        <LearningSections />
        
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Agent.tips - Prompt Engineering Academy</p>
          <p className="mt-2">
            Designed to help you master the art of communicating with AI systems effectively.
          </p>
        </footer>
      </div>
    </>
  );
} 