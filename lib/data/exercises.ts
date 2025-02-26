import { Exercise } from "../types";
import { nanoid } from "nanoid";

export const sampleExercises: Exercise[] = [
  {
    id: nanoid(),
    title: "Basic Prompt Structure",
    description: "Learn the fundamental structure of an effective prompt",
    type: "fill-in-blank",
    difficulty: "beginner",
    category: "fundamentals",
    content: {
      instructions: "Complete the missing parts of this prompt template to create a well-structured prompt.",
      template: "I want you to act as a {{role}}. Your task is to {{task}}. Consider the following context: {{context}}. The output should be {{format}}.",
      correctAnswer: ["role", "task", "context", "format"],
      hints: [
        "Think about who the AI should pretend to be",
        "What specific action should the AI perform?",
        "What background information does the AI need?",
        "How should the AI format its response?"
      ],
      explanation: "A well-structured prompt typically includes a role for the AI to assume, a specific task, relevant context, and a desired output format. This structure helps the AI understand exactly what you need."
    }
  },
  {
    id: nanoid(),
    title: "Improving Clarity",
    description: "Practice making vague prompts more specific and clear",
    type: "rewrite",
    difficulty: "beginner",
    category: "clarity",
    content: {
      instructions: "Rewrite this vague prompt to make it more specific and clear.",
      template: "Give me information about climate change.",
      correctAnswer: [
        "As an environmental scientist, provide a summary of the current scientific consensus on climate change. Include key statistics from the last 5 years, major contributing factors, and 3-4 potential mitigation strategies. Format your response with clear headings and bullet points where appropriate.",
        "I need you to act as a climate researcher and explain the current state of climate change. Please include: 1) Recent temperature trends (last decade), 2) Main causes according to scientific consensus, 3) Three major predicted impacts, and 4) Key international agreements addressing it. Keep your response under 500 words and cite reliable sources."
      ],
      hints: [
        "Specify what kind of information you want",
        "Add parameters like time period or geographic focus",
        "Request a specific format or structure",
        "Consider adding a purpose for the information"
      ],
      explanation: "Vague prompts like 'Give me information about climate change' leave too much room for interpretation. By specifying the role, exact information needed, format, and other parameters, you create a prompt that will generate more useful and targeted responses."
    }
  },
  {
    id: nanoid(),
    title: "Context Refinement",
    description: "Learn to provide relevant context for better results",
    type: "multiple-choice",
    difficulty: "intermediate",
    category: "context",
    content: {
      instructions: "Which of the following contexts would be most helpful for this prompt?",
      template: "I need you to help me debug this Python function that's supposed to sort a list of dictionaries by a specific key.",
      options: [
        "I'm a beginner programmer working on a school project.",
        "The function works sometimes but fails with KeyError occasionally.",
        "I need this done by tomorrow for my presentation.",
        "I've been coding for 5 years and usually use JavaScript."
      ],
      correctAnswer: "The function works sometimes but fails with KeyError occasionally.",
      explanation: "The most relevant context is information about the specific problem (KeyError occurring occasionally). This gives the AI concrete information about the bug, whereas the other options provide background that's less directly relevant to solving the debugging task."
    }
  },
  {
    id: nanoid(),
    title: "Specificity Challenge",
    description: "Transform general requests into specific instructions",
    type: "rewrite",
    difficulty: "intermediate",
    category: "specificity",
    content: {
      instructions: "Rewrite this general prompt to make it highly specific with clear parameters.",
      template: "Help me write a business email.",
      hints: [
        "Who is the recipient?",
        "What is the purpose of the email?",
        "What tone should be used?",
        "Are there any specific points that must be included?"
      ],
      explanation: "General requests like 'Help me write a business email' don't provide enough direction. A specific prompt would include the recipient's role, the relationship to them, the email's purpose, required tone, key points to cover, desired length, and any other constraints or requirements."
    }
  },
  {
    id: nanoid(),
    title: "Advanced Prompt Chaining",
    description: "Learn to break complex tasks into a sequence of prompts",
    type: "free-form",
    difficulty: "advanced",
    category: "advanced",
    content: {
      instructions: "Design a sequence of 3-4 prompts that work together to analyze a dataset, identify trends, and create a presentation about the findings.",
      explanation: "Complex tasks often benefit from being broken down into a sequence of prompts, where each prompt builds on the results of the previous ones. This approach allows for more control, better error checking, and more sophisticated outputs than trying to accomplish everything in a single prompt."
    }
  }
];

export default sampleExercises; 