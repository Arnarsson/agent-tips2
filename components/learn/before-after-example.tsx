"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { BeforeAfterExample } from "@/lib/data/examples";
import { 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  Info,
  BookmarkCheck
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Progress } from "../ui/progress";
import { useMediaQuery } from "@/hooks/use-media-query";
import { nanoid } from "nanoid";
import { useUserProgress } from "@/lib/contexts/UserProgressProvider";

interface PromptHighlightProps {
  text: string;
  issues?: Array<{ type: string; description: string; span: [number, number] }>;
  improvements?: Array<{ type: string; description: string; span: [number, number] }>;
}

const PromptHighlight: React.FC<PromptHighlightProps> = ({ text, issues, improvements }) => {
  const highlights = issues || improvements || [];
  const isIssue = !!issues;
  
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
    <div className="space-y-2">
      <div className="p-4 bg-muted rounded-md whitespace-pre-wrap relative">
        {segments.map((segment, index) => (
          segment.isHighlighted ? (
            <TooltipProvider key={index} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={`relative transition-colors ${
                      isIssue 
                        ? "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-b border-dashed border-red-400"
                        : "bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 border-b border-dashed border-green-400"
                    }`}
                  >
                    {segment.text}
                    <span className="inline-flex items-center justify-center h-4 w-4 text-xs rounded-full text-white absolute -top-2 -right-2 select-none">
                      {isIssue ? (
                        <AlertCircle size={14} className="text-red-500" />
                      ) : (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-sm">{highlights[segment.highlightIndex as number].type}</div>
                    <div className="text-xs text-muted-foreground">
                      {highlights[segment.highlightIndex as number].description}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span key={index}>{segment.text}</span>
          )
        ))}
      </div>
      
      {highlights.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Info size={12} className="mr-1" />
            <span>Hover highlighted text to see details</span>
          </div>
          <div className="text-xs font-medium">
            {highlights.length} {isIssue ? 'issue' : 'improvement'}{highlights.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

// Add this animation utility function near the top of the file
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

interface BeforeAfterExampleCardProps {
  example: BeforeAfterExample;
}

export const BeforeAfterExampleCard: React.FC<BeforeAfterExampleCardProps> = ({ example }) => {
  const [activeTab, setActiveTab] = useState<string>("before");
  const [expanded, setExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { markExampleAsCompleted, fundamentalsProgress, ethicsProgress, implementationProgress } = useUserProgress();
  
  // Check if this example is completed by looking in all phase progress
  const isCompleted = (example.phase === "fundamentals" && fundamentalsProgress.completedExampleIds.includes(example.id)) ||
                    (example.phase === "ethics" && ethicsProgress.completedExampleIds.includes(example.id)) ||
                    (example.phase === "implementation" && implementationProgress.completedExampleIds.includes(example.id));
  
  // Add these refs for better accessibility
  const beforeTabRef = useRef<HTMLButtonElement>(null);
  const afterTabRef = useRef<HTMLButtonElement>(null);
  
  // Calculate word counts for comparison
  const beforeWordCount = example.before.prompt.split(/\s+/).filter(Boolean).length;
  const afterWordCount = example.after.prompt.split(/\s+/).filter(Boolean).length;
  
  // Calculate response quality scores (simplified example)
  const beforeQualityScore = 60; // This would be calculated based on actual metrics
  const afterQualityScore = 95; // This would be calculated based on actual metrics
  
  // Handle keyboard navigation between tabs
  const handleKeyDown = (e: React.KeyboardEvent, tab: "before" | "after") => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const nextTab = tab === "before" ? "after" : "before";
      setActiveTab(nextTab);
      if (nextTab === "before") {
        beforeTabRef.current?.focus();
      } else {
        afterTabRef.current?.focus();
      }
    }
  };
  
  // Handle marking example as completed
  const handleMarkAsCompleted = () => {
    markExampleAsCompleted(example.phase);
  };

  return (
    <Card className={`overflow-hidden border-2 ${isCompleted ? 'border-green-500/50' : 'border-muted'}`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <div>
              <CardTitle className="text-xl font-bold">{example.title}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {example.category}
                </Badge>
                {example.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {isCompleted && (
              <div className="flex-shrink-0">
                <Badge variant="default" className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full md:w-auto mt-2 md:mt-0"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={`example-${example.id}-explanation`}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Hide Explanation
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show Explanation
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pb-4 animate-in fade-in duration-300" id={`example-${example.id}-explanation`}>
          <div className="p-4 bg-muted rounded-md text-sm">
            {example.explanation}
          </div>
        </CardContent>
      )}
      
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "before" | "after")}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between px-6 pt-2">
            <TabsList className="h-10 mb-4 md:mb-0">
              <TabsTrigger 
                value="before" 
                ref={beforeTabRef}
                onKeyDown={(e) => handleKeyDown(e, "before")}
                aria-label="Before example with issues"
                className="data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500 dark:data-[state=active]:text-red-400"
              >
                Before
              </TabsTrigger>
              <TabsTrigger 
                value="after" 
                ref={afterTabRef}
                onKeyDown={(e) => handleKeyDown(e, "after")}
                aria-label="After example with improvements"
                className="data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500 dark:data-[state=active]:text-green-400"
              >
                After
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <span>Words:</span>
                <Badge variant={activeTab === "before" ? "destructive" : "default"} className={activeTab === "after" ? "bg-green-500" : ""}>
                  {activeTab === "before" ? beforeWordCount : afterWordCount}
                </Badge>
                {activeTab === "after" && (
                  <span className="text-green-500 text-xs">
                    {afterWordCount > beforeWordCount ? `+${afterWordCount - beforeWordCount}` : `${afterWordCount - beforeWordCount}`}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span>Quality:</span>
                <div className="w-20">
                  <Progress 
                    value={activeTab === "before" ? beforeQualityScore : afterQualityScore} 
                    max={100}
                    className={activeTab === "before" ? "bg-red-200 dark:bg-red-950" : "bg-green-200 dark:bg-green-950"}
                  />
                </div>
                <span className={activeTab === "before" ? "text-red-500" : "text-green-500"}>
                  {activeTab === "before" ? beforeQualityScore : afterQualityScore}%
                </span>
              </div>
            </div>
          </div>
          
          <TabsContent value="before" className="p-6 pt-2 space-y-4 border-t animate-in fade-in duration-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  Prompt with Issues
                </h3>
                <PromptHighlight 
                  text={example.before.prompt} 
                  issues={example.before.issues}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Info className="h-5 w-5 text-muted-foreground mr-2" />
                  AI Response
                </h3>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
                  {example.before.response}
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  Issues Identified
                </h3>
                <div className="space-y-2">
                  {example.before.issues.map((issue, index) => (
                    <div key={`issue-${index}`} className="flex items-start gap-2 p-2 rounded-md bg-red-500/10">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-500 dark:text-red-400">{issue.type}</p>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="after" className="p-6 pt-2 space-y-4 border-t animate-in fade-in duration-200">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Improved Prompt
                </h3>
                <PromptHighlight 
                  text={example.after.prompt} 
                  improvements={example.after.improvements}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Info className="h-5 w-5 text-muted-foreground mr-2" />
                  AI Response
                </h3>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
                  {example.after.response}
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Improvements Made
                </h3>
                <div className="space-y-2">
                  {example.after.improvements.map((improvement, index) => (
                    <div key={`improvement-${index}`} className="flex items-start gap-2 p-2 rounded-md bg-green-500/10">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-500 dark:text-green-400">{improvement.type}</p>
                        <p className="text-sm text-muted-foreground">{improvement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between py-4 border-t">
        <Button variant="outline" size="sm" className="gap-1">
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only md:not-sr-only">Share Example</span>
        </Button>
        
        <div className="flex gap-2">
          {!isCompleted ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAsCompleted}
              className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"
            >
              <BookmarkCheck className="h-4 w-4" />
              <span>Mark as Completed</span>
            </Button>
          ) : (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200 dark:border-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab(activeTab === "before" ? "after" : "before")}
          >
            {activeTab === "before" ? "View After" : "View Before"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeforeAfterExampleCard; 