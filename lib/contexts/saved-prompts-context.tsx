"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { SavedPrompt } from "../types";

interface SavedPromptsContextType {
  savedPrompts: SavedPrompt[];
  addPrompt: (title: string, content: string, templateId?: string, tags?: string[]) => void;
  updatePrompt: (id: string, updates: Partial<SavedPrompt>) => void;
  deletePrompt: (id: string) => void;
  incrementUsageCount: (id: string) => void;
}

const SavedPromptsContext = createContext<SavedPromptsContextType | undefined>(undefined);

export function SavedPromptsProvider({ children }: { children: React.ReactNode }) {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  // Load saved prompts from localStorage on initial render
  useEffect(() => {
    const storedPrompts = localStorage.getItem("savedPrompts");
    if (storedPrompts) {
      try {
        setSavedPrompts(JSON.parse(storedPrompts));
      } catch (error) {
        console.error("Failed to parse saved prompts:", error);
      }
    }
  }, []);

  // Save prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  // Add a new prompt
  const addPrompt = (title: string, content: string, templateId?: string, tags: string[] = []) => {
    const newPrompt: SavedPrompt = {
      id: nanoid(),
      title,
      content,
      templateId,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        qualityScore: 0,
        usageCount: 0
      }
    };

    setSavedPrompts(prev => [newPrompt, ...prev]);
  };

  // Update an existing prompt
  const updatePrompt = (id: string, updates: Partial<SavedPrompt>) => {
    setSavedPrompts(prev => 
      prev.map(prompt => 
        prompt.id === id 
          ? { 
              ...prompt, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : prompt
      )
    );
  };

  // Delete a prompt
  const deletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(prompt => prompt.id !== id));
  };

  // Increment usage count for a prompt
  const incrementUsageCount = (id: string) => {
    setSavedPrompts(prev => 
      prev.map(prompt => 
        prompt.id === id 
          ? { 
              ...prompt, 
              metrics: {
                ...prompt.metrics,
                usageCount: (prompt.metrics?.usageCount || 0) + 1
              }
            } 
          : prompt
      )
    );
  };

  return (
    <SavedPromptsContext.Provider 
      value={{ 
        savedPrompts, 
        addPrompt, 
        updatePrompt, 
        deletePrompt,
        incrementUsageCount
      }}
    >
      {children}
    </SavedPromptsContext.Provider>
  );
}

export function useSavedPrompts() {
  const context = useContext(SavedPromptsContext);
  if (context === undefined) {
    throw new Error("useSavedPrompts must be used within a SavedPromptsProvider");
  }
  return context;
} 