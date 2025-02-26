"use client";

import React from "react";
import LearningSections from "@/components/learn/learning-sections";

export default function LearnPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">Prompt Engineering Academy</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the art and science of crafting effective prompts for AI models
        </p>
      </div>

      <LearningSections />
    </div>
  );
} 