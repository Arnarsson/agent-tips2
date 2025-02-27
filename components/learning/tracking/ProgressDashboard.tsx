"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { GradientHeading } from "@/components/agent/gradient-heading";
import { TextureCard } from "@/components/agent/texture-card";
import { cn } from "@/lib/utils";
import { Trophy, Zap, Calendar, Rocket } from "lucide-react";
import { useUserProgress } from "@/lib/contexts/UserProgressProvider";

export function ProgressDashboard() {
  const {
    userName,
    userRole,
    userLevel,
    currentStreak,
    timeInvested,
    overallProgress,
    fundamentalsProgress,
    nextModule,
    achievements
  } = useUserProgress();

  return (
    <div className="w-full space-y-8">
      <GradientHeading level={2}>Your Learning Journey</GradientHeading>
      <p className="text-muted-foreground">
        Track your progress and achievement milestones
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1 bg-card/50 border-0 shadow-md">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 mb-4">
              <span className="text-2xl font-bold">{userName.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <CardTitle className="text-xl">{userName}</CardTitle>
            <p className="text-muted-foreground">{userRole}</p>
            <div className="inline-flex items-center mt-2 bg-background/20 rounded-full px-3 py-1">
              <span className="text-sm mr-2">Level:</span>
              <Badge variant="secondary" className="bg-primary/20 text-primary font-normal">
                {userLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-t border-border/30 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Streak:</span>
              <span className="font-medium">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Time Invested:</span>
              <span className="font-medium">{timeInvested}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Next Achievement:</span>
              <span className="text-primary font-medium">
                {achievements.find(a => !a.completed)?.title || "All Completed!"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview Card */}
        <Card className="md:col-span-3 bg-card/50 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Your Progress Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            {/* Fundamentals Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextureCard className="bg-card/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-medium">Fundamentals</h3>
                  <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs font-semibold">1</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Module Progress</p>
                    <div className="relative h-2">
                      <div className="absolute inset-0 bg-background/50 rounded-full"></div>
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                        style={{ width: `${(fundamentalsProgress.completedModules / fundamentalsProgress.totalModules) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <p className="text-xs">{Math.round((fundamentalsProgress.completedModules / fundamentalsProgress.totalModules) * 100)}%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Examples Completed</span>
                    <span className="text-sm">{fundamentalsProgress.examplesCompleted}/{fundamentalsProgress.totalExamples}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Exercises Completed</span>
                    <span className="text-sm">{fundamentalsProgress.exercisesCompleted}/{fundamentalsProgress.totalExercises}</span>
                  </div>
                </div>
              </TextureCard>
              
              <TextureCard className="bg-card/30 p-4 rounded-xl">
                <h3 className="text-lg font-medium mb-3">Next Up</h3>
                <div className="bg-background/50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">{nextModule.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{nextModule.description}</p>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {nextModule.duration}
                  </Badge>
                </div>
              </TextureCard>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievements Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="bg-card/50 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <AchievementCard 
                  key={achievement.id}
                  icon={getAchievementIcon(achievement.icon)}
                  title={achievement.title}
                  description={achievement.description}
                  progress={achievement.progress}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Recommended Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Based on spaced repetition for optimal retention
            </p>
            
            <ReviewCard 
              title="AI Capabilities & Limitations"
              dueText="Due for review today"
              icon="📚"
            />
            
            <ReviewCard 
              title="Basic Prompt Structure"
              dueText="Due for review in 2 days"
              icon="⚡"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getAchievementIcon(iconId: string) {
  switch (iconId) {
    case 'trophy':
      return <Trophy className="h-5 w-5" />;
    case 'zap':
      return <Zap className="h-5 w-5" />;
    case 'calendar':
      return <Calendar className="h-5 w-5" />;
    case 'rocket':
      return <Rocket className="h-5 w-5" />;
    default:
      return <Trophy className="h-5 w-5" />;
  }
}

function AchievementCard({ 
  icon, 
  title, 
  description, 
  progress 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  progress: number; 
}) {
  return (
    <div className="bg-background/30 p-4 rounded-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-full bg-background/50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="h-1 bg-background/50 rounded-full overflow-hidden mt-3">
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary-foreground" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function ReviewCard({ 
  title, 
  dueText, 
  icon 
}: { 
  title: string; 
  dueText: string; 
  icon: string; 
}) {
  return (
    <div className="bg-background/30 p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-background/50 flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{dueText}</p>
        </div>
      </div>
      <Badge variant="outline" className="bg-primary/10 text-primary cursor-pointer">
        Review
      </Badge>
    </div>
  );
} 