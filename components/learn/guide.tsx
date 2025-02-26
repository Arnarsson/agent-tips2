"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";

const guideContent = {
  fundamentals: {
    title: "Prompt Engineering Fundamentals",
    sections: [
      {
        title: "What is Prompt Engineering?",
        content: (
          <div className="space-y-4">
            <p>
              Prompt engineering is the practice of crafting effective inputs (prompts) for large language models (LLMs) to generate desired outputs. It's a skill that combines understanding of how AI models work with clear communication techniques.
            </p>
            <p>
              As AI models become more powerful and widespread, the ability to effectively communicate with them becomes increasingly valuable. Prompt engineering bridges the gap between human intent and machine understanding.
            </p>
          </div>
        ),
      },
      {
        title: "Core Principles",
        content: (
          <div className="space-y-4">
            <p>
              Effective prompt engineering is built on several key principles:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Clarity:</strong> Be specific and unambiguous about what you want.</li>
              <li><strong>Context:</strong> Provide relevant background information.</li>
              <li><strong>Structure:</strong> Organize your prompt in a logical way.</li>
              <li><strong>Constraints:</strong> Define boundaries and limitations.</li>
              <li><strong>Examples:</strong> Demonstrate the desired output format.</li>
            </ul>
          </div>
        ),
      },
      {
        title: "The Prompt-Response Cycle",
        content: (
          <div className="space-y-4">
            <p>
              Interacting with AI models is an iterative process:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Craft an initial prompt based on your goal</li>
              <li>Evaluate the AI's response</li>
              <li>Refine your prompt based on the response</li>
              <li>Repeat until you achieve the desired outcome</li>
            </ol>
            <p>
              This cycle of refinement is key to mastering prompt engineering. Each iteration provides insights into how the model interprets your instructions.
            </p>
          </div>
        ),
      },
    ],
  },
  techniques: {
    title: "Advanced Techniques",
    sections: [
      {
        title: "Role Prompting",
        content: (
          <div className="space-y-4">
            <p>
              Role prompting involves asking the AI to adopt a specific persona or role when responding. This technique can dramatically change the style, tone, and content of responses.
            </p>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">Example:</p>
              <p className="text-sm mt-2">
                "As an experienced data scientist specializing in neural networks, explain how transformers work."
              </p>
            </div>
            <p>
              By assigning a role, you implicitly set expectations for expertise level, terminology usage, and perspective.
            </p>
          </div>
        ),
      },
      {
        title: "Chain-of-Thought Prompting",
        content: (
          <div className="space-y-4">
            <p>
              Chain-of-thought prompting encourages the AI to break down complex problems into step-by-step reasoning. This technique is particularly effective for logical or mathematical tasks.
            </p>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">Example:</p>
              <p className="text-sm mt-2">
                "Let's solve this problem step by step: If a shirt costs $15 and is discounted by 20%, then taxed at 8%, what is the final price?"
              </p>
            </div>
            <p>
              By explicitly requesting step-by-step reasoning, you can get more accurate results and better understand the model's thought process.
            </p>
          </div>
        ),
      },
      {
        title: "Few-Shot Learning",
        content: (
          <div className="space-y-4">
            <p>
              Few-shot learning involves providing examples of the desired input-output pairs before asking the model to perform a similar task. This technique helps the model understand patterns and expectations.
            </p>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">Example:</p>
              <p className="text-sm mt-2">
                "Classify the sentiment of these reviews:<br/><br/>
                Review: 'The food was delicious!'<br/>
                Sentiment: Positive<br/><br/>
                Review: 'Terrible service and cold food.'<br/>
                Sentiment: Negative<br/><br/>
                Review: 'The ambiance was nice but the prices were too high.'<br/>
                Sentiment: "
              </p>
            </div>
            <p>
              This approach is particularly useful for classification, formatting, or style-matching tasks.
            </p>
          </div>
        ),
      },
    ],
  },
  applications: {
    title: "Practical Applications",
    sections: [
      {
        title: "Content Creation",
        content: (
          <div className="space-y-4">
            <p>
              Prompt engineering can dramatically improve AI-generated content across various formats:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Writing:</strong> Stories, articles, marketing copy, emails</li>
              <li><strong>Creative:</strong> Poetry, scripts, song lyrics</li>
              <li><strong>Technical:</strong> Documentation, reports, analyses</li>
            </ul>
            <p>
              Effective prompts for content creation typically include specific parameters about tone, length, audience, purpose, and style.
            </p>
          </div>
        ),
      },
      {
        title: "Problem Solving",
        content: (
          <div className="space-y-4">
            <p>
              AI models can assist with various problem-solving tasks when properly prompted:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Debugging code</strong> with detailed error descriptions</li>
              <li><strong>Analyzing data</strong> with specific questions</li>
              <li><strong>Brainstorming solutions</strong> to well-defined problems</li>
              <li><strong>Decision making</strong> with clear criteria and constraints</li>
            </ul>
            <p>
              The key is to clearly define the problem, provide relevant context, and specify the desired form of solution.
            </p>
          </div>
        ),
      },
      {
        title: "Learning and Research",
        content: (
          <div className="space-y-4">
            <p>
              Prompt engineering can enhance learning and research processes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Explaining concepts</strong> at different levels of complexity</li>
              <li><strong>Summarizing information</strong> with specific focus areas</li>
              <li><strong>Creating study materials</strong> tailored to learning objectives</li>
              <li><strong>Exploring different perspectives</strong> on complex topics</li>
            </ul>
            <p>
              Effective learning prompts often specify the learner's background knowledge, learning goals, and preferred learning style.
            </p>
          </div>
        ),
      },
    ],
  },
};

export function PromptEngineeringGuide() {
  const [activeTab, setActiveTab] = useState("fundamentals");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prompt Engineering Guide</CardTitle>
        <CardDescription>
          A comprehensive resource to help you master the art and science of prompt engineering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          {Object.entries(guideContent).map(([key, section]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{section.title}</h2>
                <Separator className="my-2" />
              </div>
              
              {section.sections.map((subsection, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-xl font-semibold">{subsection.title}</h3>
                  {subsection.content}
                  {index < section.sections.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default PromptEngineeringGuide; 