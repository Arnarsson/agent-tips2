"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  BookOpen, 
  Code, 
  Dumbbell, 
  Trophy, 
  Star, 
  Award,
  CheckCircle,
  Clock,
  BarChart
} from "lucide-react";
import { motion } from "framer-motion";

interface ProgressTrackerProps {
  totalExamples: number;
  totalExercises: number;
  completedExamples: number;
  completedExercises: number;
  lastActivity?: string;
  streak?: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalExamples,
  totalExercises,
  completedExamples,
  completedExercises,
  lastActivity = "Today",
  streak = 0
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Calculate overall progress
  const totalItems = totalExamples + totalExercises;
  const completedItems = completedExamples + completedExercises;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  // Calculate examples progress
  const examplesProgress = totalExamples > 0 ? Math.round((completedExamples / totalExamples) * 100) : 0;
  
  // Calculate exercises progress
  const exercisesProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
  
  // Determine user level based on completed items
  const determineLevel = () => {
    if (completedItems >= totalItems * 0.9) return "Expert";
    if (completedItems >= totalItems * 0.7) return "Advanced";
    if (completedItems >= totalItems * 0.4) return "Intermediate";
    if (completedItems >= totalItems * 0.1) return "Beginner";
    return "Novice";
  };
  
  const level = determineLevel();
  
  // Trigger celebration animation when progress reaches certain milestones
  useEffect(() => {
    if (overallProgress === 25 || overallProgress === 50 || overallProgress === 75 || overallProgress === 100) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [overallProgress]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="relative overflow-hidden">
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 animate-pulse" />
            <div className="absolute top-10 left-1/4 text-yellow-500 animate-bounce">
              <Trophy size={24} />
            </div>
            <div className="absolute top-20 right-1/4 text-purple-500 animate-bounce" style={{ animationDelay: "0.2s" }}>
              <Star size={24} />
            </div>
            <div className="absolute bottom-10 left-1/3 text-blue-500 animate-bounce" style={{ animationDelay: "0.4s" }}>
              <Award size={24} />
            </div>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">Your Learning Progress</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Level: {level}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-primary" />
                <span className="font-medium">Overall Progress</span>
              </div>
              <span className="text-sm font-bold">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} max={100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedItems} of {totalItems} items completed
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Examples</span>
                </div>
                <span className="text-sm font-bold">{examplesProgress}%</span>
              </div>
              <Progress value={examplesProgress} max={100} className="h-2 bg-blue-100 dark:bg-blue-950" />
              <p className="text-xs text-muted-foreground mt-1">
                {completedExamples} of {totalExamples} examples reviewed
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Exercises</span>
                </div>
                <span className="text-sm font-bold">{exercisesProgress}%</span>
              </div>
              <Progress value={exercisesProgress} max={100} className="h-2 bg-green-100 dark:bg-green-950" />
              <p className="text-xs text-muted-foreground mt-1">
                {completedExercises} of {totalExercises} exercises completed
              </p>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last activity: {lastActivity}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current streak: {streak} days</span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button className="w-full" variant="outline">
              View Detailed Progress
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressTracker; 