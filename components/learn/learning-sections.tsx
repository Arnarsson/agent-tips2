"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import PromptEngineeringGuide from "./guide";
import BeforeAfterExampleCard from "./before-after-example";
import ExerciseCard from "./exercise-card";
import { sampleExamples } from "@/lib/data/examples";
import { sampleExercises } from "@/lib/data/exercises";

export function LearningSections() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="guide">Guide</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="exercises">Exercises</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Exercises</CardTitle>
              <CardDescription>
                Practice your prompt engineering skills with guided challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our interactive exercises help you apply prompt engineering principles in practical scenarios. 
                From fill-in-the-blank templates to complete rewrites, these exercises build your skills 
                progressively from beginner to advanced levels.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before & After Examples</CardTitle>
              <CardDescription>
                Learn from annotated prompt improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See real-world examples of how vague, ineffective prompts can be transformed into 
                clear, powerful instructions. Each example includes detailed annotations explaining 
                the specific improvements and why they matter.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prompt Engineering Guide</CardTitle>
              <CardDescription>
                Comprehensive resources to master prompt engineering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our comprehensive guide covers everything from fundamental concepts to advanced techniques. 
                Learn the principles, patterns, and best practices that make for effective prompt engineering 
                across different use cases.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Why Learn Prompt Engineering?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Unlock AI's Full Potential</h3>
              <p className="text-sm text-muted-foreground">
                The difference between a mediocre AI response and an exceptional one often comes down to how 
                well you communicate with the AI. Mastering prompt engineering helps you consistently get 
                high-quality, relevant outputs from AI systems.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Valuable Professional Skill</h3>
              <p className="text-sm text-muted-foreground">
                As AI becomes increasingly integrated into workflows across industries, the ability to 
                effectively prompt AI systems is becoming a valuable professional skill. Stand out in your 
                field by mastering this emerging competency.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Improve Efficiency</h3>
              <p className="text-sm text-muted-foreground">
                Well-crafted prompts save time by getting the right results on the first try, rather than 
                requiring multiple iterations. Learn to communicate your intent clearly and precisely to 
                maximize your productivity when working with AI.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Enhance Creative Workflows</h3>
              <p className="text-sm text-muted-foreground">
                For creative professionals, prompt engineering opens new possibilities for ideation, 
                content creation, and problem-solving. Learn to guide AI as a collaborative partner 
                in your creative process.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="guide" className="space-y-6 mt-6">
        <PromptEngineeringGuide />
      </TabsContent>

      <TabsContent value="examples" className="space-y-8 mt-6">
        <div className="grid grid-cols-1 gap-8">
          {sampleExamples.map((example) => (
            <BeforeAfterExampleCard key={example.id} example={example} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="exercises" className="space-y-8 mt-6">
        <div className="grid grid-cols-1 gap-8">
          {sampleExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default LearningSections; 