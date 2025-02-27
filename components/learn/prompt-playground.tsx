"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { nanoid } from "nanoid";
import { 
  Lightbulb, 
  Sparkles, 
  Send, 
  Save, 
  Copy, 
  RotateCcw, 
  BookmarkPlus,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";
import { useSavedPrompts } from "@/lib/contexts/saved-prompts-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { handleAsyncOperation, PerformanceMonitor } from "@/lib/error-handling/error-utils";
import { ComponentErrorBoundary } from "@/components/error-boundary";
import { API } from "@/lib/api";

// Add the missing calculatePromptQuality function
const calculatePromptQuality = (prompt: React.ReactElement | string): number => {
  // Convert ReactElement to string for analysis if needed
  let promptText = '';
  
  if (typeof prompt === 'string') {
    promptText = prompt;
  } else if (prompt && typeof prompt === 'object' && 'props' in prompt) {
    const props = prompt.props as Record<string, any>;
    if (props && props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html) {
      promptText = props.dangerouslySetInnerHTML.__html;
    }
  }
  
  // Logic to calculate prompt quality
  let quality = 50; // Default quality
  
  if (promptText.length > 100) {
    quality += 20;
  }
  
  if (promptText.includes("step by step")) {
    quality += 15;
  }
  
  if (promptText.includes("example")) {
    quality += 10;
  }
  
  if (promptText.includes("{{question}}") || promptText.includes("<mark")) {
    quality += 5;
  }
  
  // Cap at 100
  return Math.min(100, quality);
};

// Sample prompt templates
const PROMPT_TEMPLATES = [
  {
    id: "zero-shot",
    name: "Zero-shot",
    template: "Answer the following question: {{question}}",
    description: "Direct instruction without examples"
  },
  {
    id: "few-shot",
    name: "Few-shot",
    template: "Here are some examples:\n\nQuestion: What is the capital of France?\nAnswer: The capital of France is Paris.\n\nQuestion: What is the capital of Japan?\nAnswer: The capital of Japan is Tokyo.\n\nNow, answer the following question: {{question}}",
    description: "Instruction with examples to learn from"
  },
  {
    id: "chain-of-thought",
    name: "Chain of Thought",
    template: "Answer the following question by thinking step by step: {{question}}",
    description: "Encourages step-by-step reasoning"
  },
  {
    id: "persona",
    name: "Persona-based",
    template: "You are an expert in {{field}}. Answer the following question: {{question}}",
    description: "Assigns a specific role or expertise"
  },
  {
    id: "constraints",
    name: "Constraints",
    template: "Answer the following question in under 50 words: {{question}}",
    description: "Adds constraints to guide the response format"
  },
  {
    id: "structured-output",
    name: "Structured Output",
    template: "Provide a response to the following question in JSON format with keys for 'answer', 'reasoning', and 'confidence': {{question}}",
    description: "Requests response in a specific structured format"
  },
  {
    id: "custom",
    name: "Custom",
    template: "",
    description: "Create your own prompt template"
  }
];

// Add example prompts for quick selection
const EXAMPLE_PROMPTS = [
  {
    title: "Tech explanation",
    question: "How does blockchain technology work?",
    template: "zero-shot"
  },
  {
    title: "Historical analysis",
    question: "What were the major causes of World War I?",
    template: "chain-of-thought"
  },
  {
    title: "Career advice",
    question: "What skills should I develop to become a data scientist?",
    template: "persona",
    field: "data science and machine learning"
  },
  {
    title: "Creative writing",
    question: "Write a short story about a time traveler who changes history",
    template: "constraints"
  }
];

// Sample model options
const MODEL_OPTIONS = [
  { id: "gpt-3.5", name: "GPT-3.5" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-3", name: "Claude 3" },
  { id: "llama-3", name: "Llama 3" }
];

const getProcessedHtml = (prompt: string, question: string, field: string): string => {
  let processed = prompt;
  processed = processed.replace(/{{question}}/g, `<mark class='bg-yellow-200 px-1 rounded'>${question || '<your question>'}</mark>`);
  processed = processed.replace(/{{field}}/g, `<mark class='bg-yellow-200 px-1 rounded'>${field || '<your field>'}</mark>`);
  return processed;
};

interface PromptPlaygroundProps {
  onSavePrompt?: (prompt: string) => void;
}

export default function PromptPlayground({ onSavePrompt }: PromptPlaygroundProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(PROMPT_TEMPLATES[0].id);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].id);
  const [promptText, setPromptText] = useState(PROMPT_TEMPLATES[0].template);
  const [question, setQuestion] = useState("");
  const [field, setField] = useState("artificial intelligence");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState<Array<{id: string, prompt: string, response: string, timestamp: Date}>>([]);
  const [activeTab, setActiveTab] = useState("editor");
  const [promptQuality, setPromptQuality] = useState<number>(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  const [promptTags, setPromptTags] = useState("");
  const { toast } = useToast();
  const { addPrompt, savedPrompts } = useSavedPrompts();
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseQuality, setResponseQuality] = useState<number>(0);

  // Create performance monitor instance
  const performanceMonitorRef = useRef(new PerformanceMonitor());
  
  // Add state for errors
  const [error, setError] = useState<string | null>(null);
  
  // Add state for example selection
  const [showExamples, setShowExamples] = useState(false);

  // Update prompt text when template changes
  useEffect(() => {
    const template = PROMPT_TEMPLATES.find(t => t.id === selectedTemplate);
    if (template && template.id !== "custom") {
      setPromptText(template.template);
    }
  }, [selectedTemplate]);

  // Modify processPrompt to return JSX with highlighted variables
  const processPrompt = (prompt: string): React.ReactElement => {
    const html = getProcessedHtml(prompt, question, field);
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Send the prompt to the AI model
  const sendPrompt = async () => {
    if (!promptText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveTab("response");

    try {
      const apiResult = await handleAsyncOperation("Processing prompt", async () => {
        // In a real application, this would be an API call
        // For now, we'll simulate a response based on the prompt content
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a mock response based on the prompt content
        let responseText = "I'm sorry, I don't understand your request.";
        let responseQuality = 0.3;
        
        // Convert the processed prompt to string for comparisons
        const promptString = getProcessedHtml(promptText, question, field);
        
        if (promptString.toLowerCase().includes("hello") || promptString.toLowerCase().includes("hi")) {
          responseText = "Hello! How can I assist you today?";
          responseQuality = 0.7;
        } else if (promptString.toLowerCase().includes("help")) {
          responseText = "I'd be happy to help! Could you please provide more details about what you need assistance with?";
          responseQuality = 0.6;
        } else if (promptString.toLowerCase().includes("example")) {
          responseText = "Here's an example of how to use this feature: [Example details would go here]";
          responseQuality = 0.8;
        } else if (promptString.length > 100) {
          responseText = "Thank you for providing such detailed information. Based on what you've shared, I would recommend... [detailed response would go here]";
          responseQuality = 0.9;
        } else if (promptString.length < 20) {
          responseText = "Your prompt is quite short. Could you provide more details so I can better assist you?";
          responseQuality = 0.4;
        }
        
        // Calculate prompt quality
        const promptQuality = calculatePromptQuality(promptString);
        
        return {
          finalResponse: responseText,
          quality: promptQuality,
          responseQuality,
          responseTime: 1.5 // seconds
        };
      });
      
      if (apiResult && typeof apiResult === 'object' && 'result' in apiResult) {
        const result = apiResult.result;
        
        // Update state with the response
        setResponse(result.finalResponse);
        setPromptQuality(result.quality);
        setResponseQuality(result.responseQuality);
        setResponseTime(result.responseTime);
        
        // Add to history
        const historyItem = {
          id: nanoid(),
          prompt: getProcessedHtml(promptText, question, field),
          response: result.finalResponse,
          timestamp: new Date()
        };
        
        setPromptHistory(prev => [historyItem, ...prev]);
      }
    } catch (error) {
      console.error("Error processing prompt:", error);
      toast({
        title: "Error",
        description: "Failed to process prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy prompt to clipboard
  const copyPrompt = () => {
    navigator.clipboard.writeText(getProcessedHtml(promptText, question, field));
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard."
    });
  };

  // Reset prompt to template
  const resetPrompt = () => {
    const template = PROMPT_TEMPLATES.find(t => t.id === selectedTemplate);
    if (template) {
      setPromptText(template.template);
      toast({
        title: "Prompt reset",
        description: "The prompt has been reset to the template."
      });
    }
  };

  // Save prompt
  const handleSavePrompt = () => {
    if (onSavePrompt) {
      onSavePrompt(getProcessedHtml(promptText, question, field));
    }
    
    setSaveDialogOpen(true);
    setPromptTitle(question ? `Prompt about ${question.substring(0, 30)}...` : "My Custom Prompt");
  };

  // Handle final save with title and tags
  const handleFinalSave = () => {
    const finalPrompt = getProcessedHtml(promptText, question, field);
    const tagArray = promptTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    addPrompt(
      promptTitle,
      finalPrompt,
      selectedTemplate !== "custom" ? selectedTemplate : undefined,
      tagArray
    );
    
    setSaveDialogOpen(false);
    setPromptTitle("");
    setPromptTags("");
    
    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved to your collection."
    });
  };

  // Update getQualityIndicator to include detailed feedback
  const getQualityIndicator = () => {
    if (promptQuality >= 80) {
      return { 
        icon: <CheckCircle className="h-5 w-5 text-green-500" />, 
        text: "Excellent", 
        feedback: "Your prompt is detailed and provides sufficient context."
      };
    } else if (promptQuality >= 50) {
      return { 
        icon: <Info className="h-5 w-5 text-yellow-500" />, 
        text: "Good", 
        feedback: "Your prompt is okay, but consider adding more specific details or examples."
      };
    } else {
      return { 
        icon: <AlertCircle className="h-5 w-5 text-red-500" />, 
        text: "Needs Improvement", 
        feedback: "Your prompt is vague. Try adding more details and clear instructions."
      };
    }
  };

  // Add function to apply example prompt
  const applyExamplePrompt = (example: typeof EXAMPLE_PROMPTS[0]) => {
    setSelectedTemplate(example.template);
    setQuestion(example.question);
    if (example.field) {
      setField(example.field);
    }
    setShowExamples(false);
    
    // Find and apply template text
    const template = PROMPT_TEMPLATES.find(t => t.id === example.template);
    if (template) {
      setPromptText(template.template);
    }
    
    toast({
      title: "Example applied",
      description: `Applied example: ${example.title}`
    });
  };

  // Add performance metrics display
  const getPerformanceStatusColor = useCallback((operation: string) => {
    const rating = performanceMonitorRef.current.getPerformanceRating(operation);
    switch (rating) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }, []);

  const qualityIndicator = getQualityIndicator();

  return (
    <ComponentErrorBoundary>
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Prompt Playground
          </CardTitle>
          <CardDescription>
            Experiment with different prompt engineering techniques and see how they affect AI responses.
          </CardDescription>
          {/* Added clear instructions for using the playground */}
          <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
            <strong>How to Use:</strong>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Select a template from the dropdown (try 'Zero-shot' for a simple example).</li>
              <li>Enter your question in the provided field.</li>
              <li>Preview the prompt with highlighted variables below.</li>
              <li>Click 'Send' to simulate an AI response.</li>
              <li>Your prompt history will be saved for later review.</li>
            </ol>
            <div className="mt-2">
              <strong>Sample Prompt:</strong> Answer the following question: <mark className="bg-yellow-200 px-1 rounded">What is the capital of France?</mark>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Example prompts section */}
          <div className="w-full">
            <Button 
              variant="outline" 
              onClick={() => setShowExamples(!showExamples)}
              className="w-full justify-between"
            >
              <span>Example Prompts</span>
              {showExamples ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            {showExamples && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {EXAMPLE_PROMPTS.map((example, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-auto py-2 px-3 justify-start flex-col items-start text-left"
                    onClick={() => applyExamplePrompt(example)}
                  >
                    <span className="font-medium">{example.title}</span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {example.question}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Error message display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full">
              <label className="text-sm font-medium mb-1 block">Template</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {PROMPT_TEMPLATES.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col">
                        <span>{template.name}</span>
                        <span className="text-xs text-muted-foreground">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Model selection removed to simplify the interface */}
          </div>
          
          {/* Variable inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Question</label>
              <Textarea 
                placeholder="Enter your question here..." 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            {selectedTemplate === "persona" && (
              <div>
                <label className="text-sm font-medium mb-1 block">Field of Expertise</label>
                <Textarea 
                  placeholder="Enter the field of expertise..." 
                  value={field} 
                  onChange={(e) => setField(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="editor">Prompt Editor</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Prompt</label>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={resetPrompt}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reset to template</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={copyPrompt}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy prompt</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleSavePrompt}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save prompt</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <Textarea 
                placeholder="Enter your prompt here..." 
                value={promptText} 
                onChange={(e) => setPromptText(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Preview (with variables replaced)
                </h4>
                <div className="whitespace-pre-wrap text-sm bg-background p-3 rounded border">
                  {processPrompt(promptText)}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="response" className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Generating response...</p>
                </div>
              ) : response ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Prompt Quality:</span>
                      <div className="flex items-center gap-1">
                        {qualityIndicator.icon}
                        <span className={`text-sm`}>{qualityIndicator.text}</span>
                      </div>
                      <span className="text-xs text-gray-600">({qualityIndicator.feedback})</span>
                    </div>
                    <Badge variant={promptQuality >= 80 ? "default" : promptQuality >= 50 ? "outline" : "destructive"}>
                      {promptQuality}/100
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Response Time:</span>
                    <span className="text-sm text-muted-foreground">{responseTime !== null ? `${responseTime} ms` : 'N/A'}</span>
                  </div>
                  
                  {/* Add performance monitoring display */}
                  {performanceMonitorRef.current.getMetrics().total_operations > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Performance:</span>
                      <span className={`text-sm ${getPerformanceStatusColor('processPrompt')}`}>
                        {performanceMonitorRef.current.getPerformanceRating('processPrompt') || 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (Success rate: {performanceMonitorRef.current.getMetrics().success_rate.toFixed(0)}%)
                      </span>
                    </div>
                  )}
                  
                  <Progress value={promptQuality} className="h-2" />
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Response</h4>
                    <div className="whitespace-pre-wrap text-sm bg-background p-3 rounded border">
                      {response}
                    </div>
                  </div>
                  
                  {promptQuality < 80 && (
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                        <Lightbulb className="h-4 w-4" />
                        Improvement Suggestions
                      </h4>
                      <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        {promptQuality < 50 && (
                          <>
                            <li>Add more specific details to your prompt</li>
                            <li>Include clear instructions on the format you want</li>
                          </>
                        )}
                        {!getProcessedHtml(promptText, question, field).includes("step by step") && (
                          <li>Consider adding "step by step" to encourage detailed reasoning</li>
                        )}
                        {!getProcessedHtml(promptText, question, field).includes("examples") && promptQuality < 80 && (
                          <li>Include examples to demonstrate the desired output format</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Response Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter your prompt and click "Send" to see how the AI responds
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              {promptHistory.length > 0 ? (
                <div className="space-y-4">
                  {promptHistory.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-muted p-4 rounded-md"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium">Prompt</h4>
                        <Badge variant="outline" className="text-xs">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </Badge>
                      </div>
                      <div className="whitespace-pre-wrap text-sm bg-background p-3 rounded border mb-3">
                        {item.prompt}
                      </div>
                      <h4 className="text-sm font-medium mb-2">Response</h4>
                      <div className="whitespace-pre-wrap text-sm bg-background p-3 rounded border">
                        {item.response}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookmarkPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No History Yet</h3>
                  <p className="text-muted-foreground max-w-md">
                    Your prompt history will appear here after you send prompts
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setActiveTab("editor")}>
            Edit Prompt
          </Button>
          <Button 
            onClick={sendPrompt} 
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </CardFooter>
        
        {/* Save Prompt Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Prompt</DialogTitle>
              <DialogDescription>
                Give your prompt a title and optional tags to help organize your collection.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={promptTitle} 
                  onChange={(e) => setPromptTitle(e.target.value)}
                  placeholder="Enter a title for your prompt"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags (comma separated)</label>
                <Input 
                  value={promptTags} 
                  onChange={(e) => setPromptTags(e.target.value)}
                  placeholder="e.g. creative, storytelling, technical"
                />
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Prompt Preview</h4>
                <p className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {getProcessedHtml(promptText, question, field).substring(0, 100)}
                  {getProcessedHtml(promptText, question, field).length > 100 ? "..." : ""}
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFinalSave} disabled={!promptTitle.trim()}>
                Save Prompt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </ComponentErrorBoundary>
  );
} 