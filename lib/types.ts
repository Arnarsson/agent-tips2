import { Message } from "ai"

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

// Learning Platform Types
export type ExerciseCategory = 
  | "fundamentals" 
  | "structure" 
  | "clarity" 
  | "context" 
  | "specificity"
  | "advanced";

export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";

export type ExerciseType = "fill-in-blank" | "multiple-choice" | "free-form" | "rewrite";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  category: ExerciseCategory;
  content: {
    instructions: string;
    template?: string;
    options?: string[];
    correctAnswer?: string | string[];
    hints?: string[];
    explanation?: string;
  };
  metrics?: {
    completionRate?: number;
    averageAttempts?: number;
  };
}

export interface BeforeAfterExample {
  id: string;
  title: string;
  category: ExerciseCategory;
  tags: string[];
  before: {
    prompt: string;
    response?: string;
    issues: Array<{
      type: string;
      description: string;
      span?: [number, number]; // Start and end indices for highlighting
    }>;
  };
  after: {
    prompt: string;
    response?: string;
    improvements: Array<{
      type: string;
      description: string;
      span?: [number, number]; // Start and end indices for highlighting
    }>;
  };
  explanation: string;
}

export interface UserProgress {
  completedExercises: {
    [exerciseId: string]: {
      completed: boolean;
      attempts: number;
      lastAttemptDate: string;
      score?: number;
    };
  };
  viewedExamples: string[]; // Array of example IDs
  readGuides: string[]; // Array of guide IDs
  achievements: string[]; // Array of achievement IDs
}
