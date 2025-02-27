"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserProgress } from "@/lib/contexts/UserProgressProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import SavedPromptsList from "@/components/learn/saved-prompts-list";
import { 
  Home, 
  ChevronRight, 
  User, 
  Award, 
  BookOpen, 
  Dumbbell, 
  BarChart, 
  Calendar, 
  Clock, 
  Trophy,
  Star,
  CheckCircle,
  Settings,
  Sparkles
} from "lucide-react";

// Define achievement types
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt?: string;
  progress?: number;
  isUnlocked: boolean;
}

export default function ProfilePage() {
  const {
    fundamentalsProgress,
    ethicsProgress,
    implementationProgress,
    userName,
    userRole,
    userLevel,
    currentStreak,
    timeInvested,
    overallProgress,
    nextModule,
    achievements,
    resetProgress
  } = useUserProgress();
  
  // Calculate total examples and exercises across all phases
  const totalExamples = fundamentalsProgress.totalExamples + ethicsProgress.totalExamples + implementationProgress.totalExamples;
  const totalExercises = fundamentalsProgress.totalExercises + ethicsProgress.totalExercises + implementationProgress.totalExercises;
  const completedExamples = fundamentalsProgress.completedExamples + ethicsProgress.completedExamples + implementationProgress.completedExamples;
  const completedExercises = fundamentalsProgress.completedExercises + ethicsProgress.completedExercises + implementationProgress.completedExercises;
  
  // Calculate overall progress percentages
  const totalItems = totalExamples + totalExercises;
  const completedItems = completedExamples + completedExercises;
  const overallProgressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  // Use userLevel directly from context instead of calculating
  const level = userLevel;
  const streak = currentStreak;
  
  // Get the last activity date from the user progress context
  const lastActivityDate = new Date().toISOString().split('T')[0]; // Fallback to today
  
  // Define achievements (keep this as is or use achievements from context if available)
  const userAchievements: Achievement[] = [
    {
      id: "first-example",
      title: "First Steps",
      description: "Complete your first example",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      isUnlocked: completedExamples > 0,
      unlockedAt: completedExamples > 0 ? lastActivityDate : undefined
    },
    {
      id: "first-exercise",
      title: "Practice Makes Perfect",
      description: "Complete your first exercise",
      icon: <Dumbbell className="h-8 w-8 text-green-500" />,
      isUnlocked: completedExercises > 0,
      unlockedAt: completedExercises > 0 ? lastActivityDate : undefined
    },
    {
      id: "streak-3",
      title: "Consistency is Key",
      description: "Maintain a 3-day learning streak",
      icon: <Calendar className="h-8 w-8 text-orange-500" />,
      isUnlocked: streak >= 3,
      unlockedAt: streak >= 3 ? lastActivityDate : undefined,
      progress: streak >= 3 ? 100 : Math.round((streak / 3) * 100)
    },
    {
      id: "half-examples",
      title: "Example Explorer",
      description: "Complete 50% of all examples",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      isUnlocked: completedExamples >= totalExamples * 0.5,
      unlockedAt: completedExamples >= totalExamples * 0.5 ? lastActivityDate : undefined,
      progress: totalExamples > 0 ? Math.min(100, Math.round((completedExamples / (totalExamples * 0.5)) * 100)) : 0
    },
    {
      id: "half-exercises",
      title: "Exercise Enthusiast",
      description: "Complete 50% of all exercises",
      icon: <Dumbbell className="h-8 w-8 text-yellow-500" />,
      isUnlocked: completedExercises >= totalExercises * 0.5,
      unlockedAt: completedExercises >= totalExercises * 0.5 ? lastActivityDate : undefined,
      progress: totalExercises > 0 ? Math.min(100, Math.round((completedExercises / (totalExercises * 0.5)) * 100)) : 0
    },
    {
      id: "all-content",
      title: "Prompt Engineering Master",
      description: "Complete all examples and exercises",
      icon: <Trophy className="h-8 w-8 text-amber-500" />,
      isUnlocked: completedItems >= totalItems && totalItems > 0,
      unlockedAt: completedItems >= totalItems && totalItems > 0 ? lastActivityDate : undefined,
      progress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    }
  ];
  
  // Count unlocked achievements
  const unlockedAchievements = userAchievements.filter(a => a.isUnlocked).length;
  
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
  
  // Handle reset progress with confirmation
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  const handleResetProgress = () => {
    if (showResetConfirmation) {
      resetProgress();
      setShowResetConfirmation(false);
    } else {
      setShowResetConfirmation(true);
    }
  };
  
  return (
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
            <BreadcrumbLink href="/profile" className="flex items-center font-medium">
              <User className="h-4 w-4 mr-1" />
              <span>Profile</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <motion.div 
        className="text-center space-y-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold tracking-tight"
          variants={itemVariants}
        >
          Your Learning Profile
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Track your progress, achievements, and learning journey
        </motion.p>
        <motion.div 
          className="h-1 w-20 bg-primary mx-auto mt-4"
          variants={itemVariants}
        />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-1"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div variants={itemVariants} className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Prompt Engineer</h2>
                <Badge className="mt-2 bg-primary/20 text-primary">Level: {level}</Badge>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold">{overallProgressPercentage}%</span>
                </div>
                <Progress value={overallProgressPercentage} max={100} className="h-2" />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Examples Completed:</span>
                  <span className="font-medium">{completedExamples} / {totalExamples}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Exercises Completed:</span>
                  <span className="font-medium">{completedExercises} / {totalExercises}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Streak:</span>
                  <span className="font-medium">{streak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Achievements Unlocked:</span>
                  <span className="font-medium">{unlockedAchievements} / {userAchievements.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Activity:</span>
                  <span className="font-medium">{lastActivityDate}</span>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  variant={showResetConfirmation ? "destructive" : "outline"} 
                  size="sm" 
                  className="w-full"
                  onClick={handleResetProgress}
                >
                  {showResetConfirmation ? "Confirm Reset Progress" : "Reset Progress"}
                </Button>
                {showResetConfirmation && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    This will reset all your progress and cannot be undone.
                  </p>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Content Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-2"
        >
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="achievements" className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>Achievements</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Progress</span>
              </TabsTrigger>
              <TabsTrigger value="saved-prompts" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>Saved Prompts</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Your Achievements
                    </CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {unlockedAchievements} / {userAchievements.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userAchievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        variants={itemVariants}
                        className={`border rounded-lg p-4 ${
                          achievement.isUnlocked 
                            ? "bg-primary/5 border-primary/20" 
                            : "bg-muted/50 border-muted"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-md ${achievement.isUnlocked ? "bg-primary/10" : "bg-muted"}`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{achievement.title}</h3>
                              {achievement.isUnlocked && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {achievement.description}
                            </p>
                            
                            {achievement.progress !== undefined && !achievement.isUnlocked && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>{achievement.progress}%</span>
                                </div>
                                <Progress value={achievement.progress} max={100} className="h-1.5" />
                              </div>
                            )}
                            
                            {achievement.isUnlocked && achievement.unlockedAt && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Unlocked on: {achievement.unlockedAt}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Detailed Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Learning Progress</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Examples</span>
                          </div>
                          <span className="text-sm">
                            {completedExamples} of {totalExamples} ({totalExamples > 0 ? Math.round((completedExamples / totalExamples) * 100) : 0}%)
                          </span>
                        </div>
                        <Progress 
                          value={totalExamples > 0 ? (completedExamples / totalExamples) * 100 : 0} 
                          max={100} 
                          className="h-2 bg-blue-100 dark:bg-blue-950" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Exercises</span>
                          </div>
                          <span className="text-sm">
                            {completedExercises} of {totalExercises} ({totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0}%)
                          </span>
                        </div>
                        <Progress 
                          value={totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0} 
                          max={100} 
                          className="h-2 bg-green-100 dark:bg-green-950" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Learning Activity</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">{streak}</p>
                        <p className="text-sm text-muted-foreground">Day Streak</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">{lastActivityDate}</p>
                        <p className="text-sm text-muted-foreground">Last Activity</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <Star className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-2xl font-bold">{level}</p>
                        <p className="text-sm text-muted-foreground">Current Level</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="saved-prompts">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Your Saved Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SavedPromptsList />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Agent.tips - Prompt Engineering Academy</p>
        <p className="mt-2">
          Designed to help you master the art of communicating with AI systems effectively.
        </p>
      </footer>
    </div>
  );
} 