"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { sampleExamples } from "@/lib/data/examples";
import { sampleExercises } from "@/lib/data/exercises";
import { getPersonalizedRecommendations } from "@/lib/data/recommendations";

interface UserProgressContextType {
  // Completed items
  completedExampleIds: string[];
  completedExerciseIds: string[];
  
  // Progress stats
  totalExamples: number;
  totalExercises: number;
  completedExamples: number;
  completedExercises: number;
  
  // User preferences and stats
  userInterests: string[];
  lastActivityDate: string;
  streak: number;
  
  // Actions
  markExampleAsCompleted: (id: string) => void;
  markExerciseAsCompleted: (id: string) => void;
  updateUserInterests: (interests: string[]) => void;
  resetProgress: () => void;
  
  // Recommendations
  recommendations: any[];
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [completedExampleIds, setCompletedExampleIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("completedExampleIds");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("completedExerciseIds");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [userInterests, setUserInterests] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userInterests");
      return saved ? JSON.parse(saved) : ["clarity", "few-shot learning", "reasoning"];
    }
    return ["clarity", "few-shot learning", "reasoning"];
  });
  
  const [lastActivityDate, setLastActivityDate] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lastActivityDate");
      return saved || new Date().toISOString().split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  });
  
  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("streak");
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });
  
  // Calculate total counts
  const totalExamples = sampleExamples.length;
  const totalExercises = sampleExercises.length;
  const completedExamples = completedExampleIds.length;
  const completedExercises = completedExerciseIds.length;
  
  // Get personalized recommendations
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  // Update recommendations when completed items or interests change
  useEffect(() => {
    const newRecommendations = getPersonalizedRecommendations(
      completedExampleIds,
      completedExerciseIds,
      userInterests
    );
    setRecommendations(newRecommendations);
  }, [completedExampleIds, completedExerciseIds, userInterests]);
  
  // Update streak and last activity date
  useEffect(() => {
    if (typeof window !== "undefined") {
      const today = new Date().toISOString().split("T")[0];
      
      if (lastActivityDate !== today) {
        // Check if the last activity was yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        
        if (lastActivityDate === yesterdayStr) {
          // Increment streak if last activity was yesterday
          setStreak(prev => prev + 1);
        } else {
          // Reset streak if there was a gap
          setStreak(1);
        }
        
        setLastActivityDate(today);
      }
    }
  }, [lastActivityDate]);
  
  // Persist state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("completedExampleIds", JSON.stringify(completedExampleIds));
      localStorage.setItem("completedExerciseIds", JSON.stringify(completedExerciseIds));
      localStorage.setItem("userInterests", JSON.stringify(userInterests));
      localStorage.setItem("lastActivityDate", lastActivityDate);
      localStorage.setItem("streak", streak.toString());
    }
  }, [completedExampleIds, completedExerciseIds, userInterests, lastActivityDate, streak]);
  
  // Mark an example as completed
  const markExampleAsCompleted = (id: string) => {
    if (!completedExampleIds.includes(id)) {
      setCompletedExampleIds(prev => [...prev, id]);
      updateLastActivity();
    }
  };
  
  // Mark an exercise as completed
  const markExerciseAsCompleted = (id: string) => {
    if (!completedExerciseIds.includes(id)) {
      setCompletedExerciseIds(prev => [...prev, id]);
      updateLastActivity();
    }
  };
  
  // Update user interests
  const updateUserInterests = (interests: string[]) => {
    setUserInterests(interests);
  };
  
  // Reset all progress
  const resetProgress = () => {
    setCompletedExampleIds([]);
    setCompletedExerciseIds([]);
    setStreak(1);
    updateLastActivity();
  };
  
  // Update last activity date to today
  const updateLastActivity = () => {
    const today = new Date().toISOString().split("T")[0];
    setLastActivityDate(today);
  };
  
  const value = {
    completedExampleIds,
    completedExerciseIds,
    totalExamples,
    totalExercises,
    completedExamples,
    completedExercises,
    userInterests,
    lastActivityDate,
    streak,
    markExampleAsCompleted,
    markExerciseAsCompleted,
    updateUserInterests,
    resetProgress,
    recommendations
  };
  
  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error("useUserProgress must be used within a UserProgressProvider");
  }
  return context;
};

export default UserProgressContext; 