import { RecommendationItem } from "@/components/learn/learning-recommendations";

export const sampleRecommendations: RecommendationItem[] = [
  {
    id: "rec-1",
    title: "Mastering Context Windows",
    type: "example",
    category: "Advanced Techniques",
    difficulty: "intermediate",
    estimatedTime: "10 min",
    tags: ["context window", "token optimization", "memory management"],
    reason: "Based on your interest in prompt optimization techniques and completion of basic examples."
  },
  {
    id: "rec-2",
    title: "Chain-of-Thought Exercise",
    type: "exercise",
    category: "Reasoning Techniques",
    difficulty: "advanced",
    estimatedTime: "15 min",
    tags: ["chain-of-thought", "reasoning", "problem-solving"],
    reason: "This builds on your completed exercises in basic prompting and helps develop advanced reasoning skills."
  },
  {
    id: "rec-3",
    title: "Prompt Engineering for Code Generation",
    type: "guide",
    category: "Specialized Applications",
    difficulty: "intermediate",
    estimatedTime: "20 min",
    tags: ["code generation", "programming", "technical prompts"],
    reason: "Recommended based on your profile interests and completion of basic prompt engineering concepts."
  },
  {
    id: "rec-4",
    title: "Few-Shot Learning Techniques",
    type: "example",
    category: "Prompt Patterns",
    difficulty: "beginner",
    estimatedTime: "8 min",
    tags: ["few-shot learning", "examples", "pattern matching"],
    reason: "A fundamental technique that will help improve your results across various AI tasks."
  },
  {
    id: "rec-5",
    title: "Crafting Clear Instructions",
    type: "exercise",
    category: "Fundamentals",
    difficulty: "beginner",
    estimatedTime: "12 min",
    tags: ["clarity", "instructions", "basics"],
    reason: "This exercise will help strengthen your foundation in creating unambiguous prompts."
  }
];

// Function to get personalized recommendations based on user progress
export const getPersonalizedRecommendations = (
  completedExampleIds: string[],
  completedExerciseIds: string[],
  userInterests: string[] = []
): RecommendationItem[] => {
  // This is a simplified recommendation algorithm
  // In a real application, this would be more sophisticated
  
  // Filter out completed items
  const allCompletedIds = [...completedExampleIds, ...completedExerciseIds];
  const availableRecommendations = sampleRecommendations.filter(
    rec => !allCompletedIds.includes(rec.id)
  );
  
  // Sort by matching user interests
  return availableRecommendations.sort((a, b) => {
    const aMatchCount = a.tags.filter(tag => userInterests.includes(tag)).length;
    const bMatchCount = b.tags.filter(tag => userInterests.includes(tag)).length;
    
    // Sort by match count (descending) and then by difficulty level
    if (aMatchCount !== bMatchCount) {
      return bMatchCount - aMatchCount;
    }
    
    // Sort by difficulty (beginner first, then intermediate, then advanced)
    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
           difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
  });
}; 