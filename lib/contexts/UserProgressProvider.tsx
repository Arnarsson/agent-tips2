"use client";

import React, { createContext, useContext } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  userProgressAtom,
  timeInvestedFormattedAtom,
  fundamentalsProgressAtom,
  ethicsProgressAtom,
  implementationProgressAtom,
  nextModuleAtom,
  achievementsAtom,
  markModuleAsCompletedAction,
  markExampleAsCompletedAction,
  markExerciseAsCompletedAction,
  createProjectAction,
} from "../atoms/userProgress";

// Create a context to provide user progress and related actions
type UserProgressContextType = {
  userName: string;
  userRole: string;
  userLevel: string;
  currentStreak: number;
  timeInvested: string;
  overallProgress: number;
  fundamentalsProgress: any;
  ethicsProgress: any;
  implementationProgress: any;
  nextModule: any;
  achievements: any[];
  markModuleAsCompleted: (moduleId: string) => void;
  markExampleAsCompleted: (phaseId: string) => void;
  markExerciseAsCompleted: (phaseId: string) => void;
  createProject: () => void;
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useAtom(userProgressAtom);
  const timeInvested = useAtomValue(timeInvestedFormattedAtom);
  const fundamentalsProgress = useAtomValue(fundamentalsProgressAtom);
  const ethicsProgress = useAtomValue(ethicsProgressAtom);
  const implementationProgress = useAtomValue(implementationProgressAtom);
  const nextModule = useAtomValue(nextModuleAtom);
  const achievements = useAtomValue(achievementsAtom);

  // Define action handlers
  const markModuleAsCompleted = (moduleId: string) => {
    markModuleAsCompletedAction((get: any) => get, setUserProgress, moduleId);
  };

  const markExampleAsCompleted = (phaseId: string) => {
    markExampleAsCompletedAction((get: any) => get, setUserProgress, phaseId);
  };

  const markExerciseAsCompleted = (phaseId: string) => {
    markExerciseAsCompletedAction((get: any) => get, setUserProgress, phaseId);
  };

  const createProject = () => {
    createProjectAction((get: any) => get, setUserProgress);
  };

  // Create the context value
  const contextValue: UserProgressContextType = {
    userName: userProgress.userName,
    userRole: userProgress.userRole,
    userLevel: userProgress.userLevel,
    currentStreak: userProgress.currentStreak,
    timeInvested,
    overallProgress: userProgress.overallProgress,
    fundamentalsProgress,
    ethicsProgress,
    implementationProgress,
    nextModule,
    achievements,
    markModuleAsCompleted,
    markExampleAsCompleted,
    markExerciseAsCompleted,
    createProject,
  };

  return (
    <UserProgressContext.Provider value={contextValue}>
      {children}
    </UserProgressContext.Provider>
  );
};

// Custom hook to use the user progress context
export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error("useUserProgress must be used within a UserProgressProvider");
  }
  return context;
}; 