"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { BeforeAfterExample } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

interface PromptHighlightProps {
  text: string;
  issues?: Array<{ type: string; description: string; span: [number, number] }>;
  improvements?: Array<{ type: string; description: string; span: [number, number] }>;
}

const PromptHighlight: React.FC<PromptHighlightProps> = ({ text, issues, improvements }) => {
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  
  const highlights = issues || improvements || [];
  
  // Create an array of segments with their highlight status
  const segments: Array<{ text: string; highlightIndex: number | null; isHighlighted: boolean }> = [];
  
  if (highlights.length === 0) {
    segments.push({ text, highlightIndex: null, isHighlighted: false });
  } else {
    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.span[0] - b.span[0]);
    
    let lastEnd = 0;
    
    sortedHighlights.forEach((highlight, index) => {
      const [start, end] = highlight.span;
      
      // Add non-highlighted text before this highlight
      if (start > lastEnd) {
        segments.push({
          text: text.substring(lastEnd, start),
          highlightIndex: null,
          isHighlighted: false
        });
      }
      
      // Add highlighted text
      segments.push({
        text: text.substring(start, end),
        highlightIndex: index,
        isHighlighted: true
      });
      
      lastEnd = end;
    });
    
    // Add any remaining text after the last highlight
    if (lastEnd < text.length) {
      segments.push({
        text: text.substring(lastEnd),
        highlightIndex: null,
        isHighlighted: false
      });
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
        {segments.map((segment, index) => (
          <span
            key={index}
            className={`relative ${
              segment.isHighlighted
                ? segment.highlightIndex === activeHighlight
                  ? "bg-yellow-200 dark:bg-yellow-900"
                  : "bg-yellow-100 dark:bg-yellow-950 cursor-pointer"
                : ""
            }`}
            onClick={() => {
              if (segment.highlightIndex !== null) {
                setActiveHighlight(
                  segment.highlightIndex === activeHighlight ? null : segment.highlightIndex
                );
              }
            }}
          >
            {segment.text}
          </span>
        ))}
      </div>
      
      {activeHighlight !== null && highlights[activeHighlight] && (
        <div className="p-3 border rounded-md bg-card">
          <p className="font-medium text-sm">{highlights[activeHighlight].type}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {highlights[activeHighlight].description}
          </p>
        </div>
      )}
      
      {highlights.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Click on highlighted text to see details
        </div>
      )}
    </div>
  );
};

interface BeforeAfterExampleCardProps {
  example: BeforeAfterExample;
}

export const BeforeAfterExampleCard: React.FC<BeforeAfterExampleCardProps> = ({ example }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{example.title}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="mr-1">
                {example.category}
              </Badge>
              {example.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="mr-1">
                  {tag}
                </Badge>
              ))}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="before" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="before">Before</TabsTrigger>
            <TabsTrigger value="after">After</TabsTrigger>
          </TabsList>
          
          <TabsContent value="before" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Prompt:</h3>
              <PromptHighlight text={example.before.prompt} issues={example.before.issues} />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Response:</h3>
              <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
                {example.before.response}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="after" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Prompt:</h3>
              <PromptHighlight
                text={example.after.prompt}
                improvements={example.after.improvements}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Response:</h3>
              <div className="p-4 bg-muted rounded-md text-sm whitespace-pre-wrap">
                {example.after.response}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-xs"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Hide explanation
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Show explanation
            </>
          )}
        </Button>
        
        {showExplanation && (
          <div className="mt-2 text-sm p-4 bg-muted rounded-md w-full">
            {example.explanation}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default BeforeAfterExampleCard; 