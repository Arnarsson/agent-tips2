import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Define types for the learning progress data
export type Module = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
};

export type PhaseProgress = {
  id: string;
  name: string;
  completedModules: number;
  totalModules: number;
  modules: Module[];
  examplesCompleted: number;
  totalExamples: number;
  exercisesCompleted: number;
  totalExercises: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  completed: boolean;
  icon: string; // Icon identifier
};

export type UserProgress = {
  userName: string;
  userRole: string;
  userLevel: string;
  currentStreak: number;
  lastActivity: string; // ISO date string
  timeInvested: number; // In minutes
  overallProgress: number; // 0-100
  phases: {
    fundamentals: PhaseProgress;
    ethics: PhaseProgress;
    implementation: PhaseProgress;
  };
  achievements: Achievement[];
  nextModuleId: string;
};

// Create example module data for each phase
const fundamentalsModules: Module[] = [
  { id: "ai-basics", title: "AI Basics", duration: "1.5h", completed: false },
  { id: "prompt-structure", title: "Prompt Structure", duration: "2h", completed: false },
  { id: "best-practices", title: "Best Practices", duration: "1h", completed: false },
];

const ethicsModules: Module[] = [
  { id: "bias-detection", title: "Bias Detection", duration: "2h", completed: false },
  { id: "ethical-guidelines", title: "Ethical Guidelines", duration: "1.5h", completed: false },
  { id: "governance-framework", title: "Governance Framework", duration: "3h", completed: false },
];

const implementationModules: Module[] = [
  { id: "use-case-planning", title: "Use Case Planning", duration: "2h", completed: false },
  { id: "integration-strategy", title: "Integration Strategy", duration: "3h", completed: false },
  { id: "roi-measurement", title: "ROI Measurement", duration: "2h", completed: false },
];

// Create default achievements
const defaultAchievements: Achievement[] = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first example",
    progress: 0,
    completed: false,
    icon: "trophy",
  },
  {
    id: "practice-master",
    title: "Practice Master",
    description: "Complete your first exercise",
    progress: 0,
    completed: false,
    icon: "zap",
  },
  {
    id: "streak-master",
    title: "Streak Master",
    description: "Maintain a 3-day streak",
    progress: 0,
    completed: false,
    icon: "calendar",
  },
  {
    id: "implementation-pro",
    title: "Implementation Pro",
    description: "Create your first project",
    progress: 0,
    completed: false,
    icon: "rocket",
  },
];

// Create default user progress
const defaultUserProgress: UserProgress = {
  userName: "User",
  userRole: "Learner",
  userLevel: "Beginner",
  currentStreak: 0,
  lastActivity: new Date().toISOString(),
  timeInvested: 0,
  overallProgress: 0,
  phases: {
    fundamentals: {
      id: "fundamentals",
      name: "Fundamentals",
      completedModules: 0,
      totalModules: fundamentalsModules.length,
      modules: fundamentalsModules,
      examplesCompleted: 0,
      totalExamples: 3,
      exercisesCompleted: 0,
      totalExercises: 5,
    },
    ethics: {
      id: "ethics",
      name: "Ethics",
      completedModules: 0,
      totalModules: ethicsModules.length,
      modules: ethicsModules,
      examplesCompleted: 0,
      totalExamples: 3,
      exercisesCompleted: 0,
      totalExercises: 4,
    },
    implementation: {
      id: "implementation",
      name: "Implementation",
      completedModules: 0,
      totalModules: implementationModules.length,
      modules: implementationModules,
      examplesCompleted: 0,
      totalExamples: 2,
      exercisesCompleted: 0,
      totalExercises: 3,
    },
  },
  achievements: defaultAchievements,
  nextModuleId: "ai-basics",
};

// Create a persisted atom for user progress
export const userProgressAtom = atomWithStorage<UserProgress>('user-progress', defaultUserProgress);

// Derived atoms for specific parts of the user progress
export const userNameAtom = atom(
  (get) => get(userProgressAtom).userName,
  (get, set, newName: string) => {
    const currentProgress = get(userProgressAtom);
    set(userProgressAtom, {
      ...currentProgress,
      userName: newName,
    });
  }
);

export const userRoleAtom = atom(
  (get) => get(userProgressAtom).userRole,
  (get, set, newRole: string) => {
    const currentProgress = get(userProgressAtom);
    set(userProgressAtom, {
      ...currentProgress,
      userRole: newRole,
    });
  }
);

export const currentStreakAtom = atom(
  (get) => get(userProgressAtom).currentStreak,
  (get, set, newStreak: number) => {
    const currentProgress = get(userProgressAtom);
    set(userProgressAtom, {
      ...currentProgress,
      currentStreak: newStreak,
    });
  }
);

export const overallProgressAtom = atom(
  (get) => get(userProgressAtom).overallProgress
);

export const timeInvestedFormattedAtom = atom(
  (get) => {
    const minutes = get(userProgressAtom).timeInvested;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} minutes`;
    } else if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} min`;
    }
  }
);

export const fundamentalsProgressAtom = atom(
  (get) => get(userProgressAtom).phases.fundamentals
);

export const ethicsProgressAtom = atom(
  (get) => get(userProgressAtom).phases.ethics
);

export const implementationProgressAtom = atom(
  (get) => get(userProgressAtom).phases.implementation
);

export const nextModuleAtom = atom(
  (get) => {
    const userProgress = get(userProgressAtom);
    const nextModuleId = userProgress.nextModuleId;
    
    // Find the next module across all phases
    for (const phaseKey of Object.keys(userProgress.phases)) {
      const phase = userProgress.phases[phaseKey as keyof typeof userProgress.phases];
      const foundModule = phase.modules.find(m => m.id === nextModuleId);
      
      if (foundModule) {
        return {
          id: foundModule.id,
          title: foundModule.title,
          description: `Continue learning about ${foundModule.title.toLowerCase()}`,
          duration: foundModule.duration,
          phase: phase.name,
        };
      }
    }
    
    // Default to first incomplete module if next module not found
    for (const phaseKey of Object.keys(userProgress.phases)) {
      const phase = userProgress.phases[phaseKey as keyof typeof userProgress.phases];
      const firstIncompleteModule = phase.modules.find(m => !m.completed);
      
      if (firstIncompleteModule) {
        return {
          id: firstIncompleteModule.id,
          title: firstIncompleteModule.title,
          description: `Start learning about ${firstIncompleteModule.title.toLowerCase()}`,
          duration: firstIncompleteModule.duration,
          phase: phase.name,
        };
      }
    }
    
    // All modules completed
    return {
      id: "completed",
      title: "All Modules Completed",
      description: "Congratulations! You've completed all modules.",
      duration: "",
      phase: "Completed",
    };
  }
);

export const achievementsAtom = atom(
  (get) => get(userProgressAtom).achievements
);

// Action to mark a module as completed
export const markModuleAsCompletedAction = (get: any, set: any, moduleId: string) => {
  const currentProgress = get(userProgressAtom);
  let updatedProgress = { ...currentProgress };
  let moduleFound = false;
  
  // Update the specific module and phase
  for (const phaseKey of Object.keys(updatedProgress.phases)) {
    const phaseKeyTyped = phaseKey as keyof typeof updatedProgress.phases;
    const phase = updatedProgress.phases[phaseKeyTyped];
    
    const moduleIndex = phase.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex >= 0 && !phase.modules[moduleIndex].completed) {
      // Update the specific module
      phase.modules[moduleIndex].completed = true;
      moduleFound = true;
      
      // Update the phase's completed modules count
      phase.completedModules += 1;
      
      // Find next module to recommend
      const nextIncompleteModuleIndex = phase.modules.findIndex(m => !m.completed);
      if (nextIncompleteModuleIndex >= 0) {
        updatedProgress.nextModuleId = phase.modules[nextIncompleteModuleIndex].id;
      } else {
        // If all modules in current phase are completed, find first incomplete module in next phase
        const phaseKeys = Object.keys(updatedProgress.phases);
        const currentPhaseIndex = phaseKeys.indexOf(phaseKey);
        let nextPhaseFound = false;
        
        for (let i = currentPhaseIndex + 1; i < phaseKeys.length; i++) {
          const nextPhaseKey = phaseKeys[i] as keyof typeof updatedProgress.phases;
          const nextPhase = updatedProgress.phases[nextPhaseKey];
          const firstIncompleteModule = nextPhase.modules.find(m => !m.completed);
          
          if (firstIncompleteModule) {
            updatedProgress.nextModuleId = firstIncompleteModule.id;
            nextPhaseFound = true;
            break;
          }
        }
        
        // If no next phase found, loop back to first phase
        if (!nextPhaseFound) {
          updatedProgress.nextModuleId = "completed";
        }
      }
      
      break;
    }
  }
  
  if (moduleFound) {
    // Update overall progress
    const totalModules = Object.values(updatedProgress.phases).reduce(
      (total, phase) => total + phase.totalModules, 0
    );
    const completedModules = Object.values(updatedProgress.phases).reduce(
      (total, phase) => total + phase.completedModules, 0
    );
    
    updatedProgress.overallProgress = Math.round((completedModules / totalModules) * 100);
    
    // Add time invested - assume average module takes 45 minutes
    updatedProgress.timeInvested += 45;
    
    // Update streak if needed
    const lastActivityDate = new Date(updatedProgress.lastActivity).toDateString();
    const todayDate = new Date().toDateString();
    
    if (lastActivityDate !== todayDate) {
      const lastActivity = new Date(updatedProgress.lastActivity);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day, increment streak
        updatedProgress.currentStreak += 1;
      } else {
        // Non-consecutive day, reset streak
        updatedProgress.currentStreak = 1;
      }
      
      // Update achievements - check streak achievement
      const streakAchievementIndex = updatedProgress.achievements.findIndex(a => a.id === "streak-master");
      if (streakAchievementIndex >= 0) {
        const streakProgress = Math.min(100, (updatedProgress.currentStreak / 3) * 100);
        updatedProgress.achievements[streakAchievementIndex].progress = streakProgress;
        
        if (streakProgress >= 100 && !updatedProgress.achievements[streakAchievementIndex].completed) {
          updatedProgress.achievements[streakAchievementIndex].completed = true;
        }
      }
    }
    
    // Update last activity
    updatedProgress.lastActivity = new Date().toISOString();
    
    // Update user level based on progress
    if (updatedProgress.overallProgress >= 75) {
      updatedProgress.userLevel = "Advanced";
    } else if (updatedProgress.overallProgress >= 30) {
      updatedProgress.userLevel = "Intermediate";
    } else if (updatedProgress.overallProgress > 0) {
      updatedProgress.userLevel = "Beginner";
    }
    
    set(userProgressAtom, updatedProgress);
  }
};

// Action to mark example as completed
export const markExampleAsCompletedAction = (get: any, set: any, phaseId: string) => {
  const currentProgress = get(userProgressAtom);
  let updatedProgress = { ...currentProgress };
  
  const phaseKeyTyped = phaseId as keyof typeof updatedProgress.phases;
  if (updatedProgress.phases[phaseKeyTyped]) {
    const phase = updatedProgress.phases[phaseKeyTyped];
    
    if (phase.examplesCompleted < phase.totalExamples) {
      phase.examplesCompleted += 1;
      
      // Update first-steps achievement if this is the first example completed
      const totalExamplesCompleted = Object.values(updatedProgress.phases).reduce(
        (total, p) => total + p.examplesCompleted, 0
      );
      
      if (totalExamplesCompleted === 1) {
        const firstStepsIndex = updatedProgress.achievements.findIndex(a => a.id === "first-steps");
        if (firstStepsIndex >= 0) {
          updatedProgress.achievements[firstStepsIndex].progress = 100;
          updatedProgress.achievements[firstStepsIndex].completed = true;
        }
      }
      
      // Add time invested - assume example takes 15 minutes
      updatedProgress.timeInvested += 15;
      
      // Update last activity
      updatedProgress.lastActivity = new Date().toISOString();
      
      set(userProgressAtom, updatedProgress);
    }
  }
};

// Action to mark exercise as completed
export const markExerciseAsCompletedAction = (get: any, set: any, phaseId: string) => {
  const currentProgress = get(userProgressAtom);
  let updatedProgress = { ...currentProgress };
  
  const phaseKeyTyped = phaseId as keyof typeof updatedProgress.phases;
  if (updatedProgress.phases[phaseKeyTyped]) {
    const phase = updatedProgress.phases[phaseKeyTyped];
    
    if (phase.exercisesCompleted < phase.totalExercises) {
      phase.exercisesCompleted += 1;
      
      // Update practice-master achievement if this is the first exercise completed
      const totalExercisesCompleted = Object.values(updatedProgress.phases).reduce(
        (total, p) => total + p.exercisesCompleted, 0
      );
      
      if (totalExercisesCompleted === 1) {
        const practiceMasterIndex = updatedProgress.achievements.findIndex(a => a.id === "practice-master");
        if (practiceMasterIndex >= 0) {
          updatedProgress.achievements[practiceMasterIndex].progress = 100;
          updatedProgress.achievements[practiceMasterIndex].completed = true;
        }
      }
      
      // Add time invested - assume exercise takes 30 minutes
      updatedProgress.timeInvested += 30;
      
      // Update last activity
      updatedProgress.lastActivity = new Date().toISOString();
      
      set(userProgressAtom, updatedProgress);
    }
  }
};

// Action to create a project (implementation achievement)
export const createProjectAction = (get: any, set: any) => {
  const currentProgress = get(userProgressAtom);
  let updatedProgress = { ...currentProgress };
  
  // Update implementation-pro achievement
  const implementationProIndex = updatedProgress.achievements.findIndex(a => a.id === "implementation-pro");
  if (implementationProIndex >= 0 && !updatedProgress.achievements[implementationProIndex].completed) {
    updatedProgress.achievements[implementationProIndex].progress = 100;
    updatedProgress.achievements[implementationProIndex].completed = true;
    
    // Add time invested - assume project creation takes 60 minutes
    updatedProgress.timeInvested += 60;
    
    // Update last activity
    updatedProgress.lastActivity = new Date().toISOString();
    
    set(userProgressAtom, updatedProgress);
  }
}; 