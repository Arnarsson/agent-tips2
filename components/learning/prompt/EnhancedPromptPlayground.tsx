"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GradientHeading } from "@/components/agent/gradient-heading";
import { TextureCard } from "@/components/agent/texture-card";
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
  Building2,
  Users,
  ShoppingCart,
  Code,
  BarChart3
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  parameters: TemplateParameter[];
};

type TemplateParameter = {
  id: string;
  name: string;
  label: string;
  type: 'select' | 'text';
  options?: { value: string; label: string }[];
  defaultValue: string;
  value: string;
};

// Template categories
const TEMPLATE_CATEGORIES = [
  { id: 'business', name: 'Business', icon: <Building2 className="h-4 w-4 mr-2" /> },
  { id: 'hr', name: 'HR & Policy', icon: <Users className="h-4 w-4 mr-2" /> },
  { id: 'marketing', name: 'Marketing', icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
  { id: 'technical', name: 'Technical', icon: <Code className="h-4 w-4 mr-2" /> },
  { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
];

// Sample HR policy template
const HR_POLICY_TEMPLATE: Template = {
  id: 'remote-work-policy',
  name: 'HR Policy Template',
  description: 'Create professional, compliant HR policies with customizable parameters',
  category: 'hr',
  template: 'Create a [policyType] policy for a [industry] company with [companySize] that includes:\n\n1. Eligibility criteria for remote work positions\n2. Equipment and technology requirements/provisions\n3. Communication protocols and availability expectations\n4. Performance measurement and evaluation procedures\n\nThe policy should use [tone] tone, [formalityLevel] formality, and comply with [region] labor regulations.',
  parameters: [
    {
      id: 'policyType',
      name: 'policyType',
      label: 'Policy Type',
      type: 'select',
      options: [
        { value: 'Remote Work', label: 'Remote Work' },
        { value: 'Hybrid Work', label: 'Hybrid Work' },
        { value: 'Code of Conduct', label: 'Code of Conduct' },
        { value: 'Data Privacy', label: 'Data Privacy' },
      ],
      defaultValue: 'Remote Work',
      value: 'Remote Work',
    },
    {
      id: 'tone',
      name: 'tone',
      label: 'Tone',
      type: 'select',
      options: [
        { value: 'Professional', label: 'Professional' },
        { value: 'Friendly', label: 'Friendly' },
        { value: 'Formal', label: 'Formal' },
      ],
      defaultValue: 'Professional',
      value: 'Professional',
    },
    {
      id: 'region',
      name: 'region',
      label: 'Region',
      type: 'select',
      options: [
        { value: 'Nordics', label: 'Nordics' },
        { value: 'EU', label: 'EU' },
        { value: 'US', label: 'US' },
        { value: 'Global', label: 'Global' },
      ],
      defaultValue: 'Nordics',
      value: 'Nordics',
    },
    {
      id: 'companySize',
      name: 'companySize',
      label: 'Company Size',
      type: 'select',
      options: [
        { value: '50-500 employees', label: '50-500 employees' },
        { value: '500-1000 employees', label: '500-1000 employees' },
        { value: '1000+ employees', label: '1000+ employees' },
      ],
      defaultValue: '50-500 employees',
      value: '50-500 employees',
    },
    {
      id: 'industry',
      name: 'industry',
      label: 'Industry',
      type: 'select',
      options: [
        { value: 'Technology', label: 'Technology' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Retail', label: 'Retail' },
      ],
      defaultValue: 'Technology',
      value: 'Technology',
    },
    {
      id: 'formalityLevel',
      name: 'formalityLevel',
      label: 'Formality Level',
      type: 'select',
      options: [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
      defaultValue: 'Medium',
      value: 'Medium',
    },
  ],
};

// Sample templates for different categories
const SAMPLE_TEMPLATES = [
  HR_POLICY_TEMPLATE,
  // Additional templates would be here
];

export function EnhancedPromptPlayground() {
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [activeCategory, setActiveCategory] = useState<string>("hr");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(HR_POLICY_TEMPLATE);
  const [promptText, setPromptText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  
  // Initialize prompt with template
  React.useEffect(() => {
    if (selectedTemplate) {
      let newPrompt = selectedTemplate.template;
      
      // Replace parameters in the template with their current values
      selectedTemplate.parameters.forEach(param => {
        newPrompt = newPrompt.replace(`[${param.name}]`, param.value);
      });
      
      setPromptText(newPrompt);
    }
  }, [selectedTemplate]);
  
  // Handle parameter changes
  const handleParameterChange = (parameterId: string, value: string) => {
    const updatedTemplate = {
      ...selectedTemplate,
      parameters: selectedTemplate.parameters.map(param => 
        param.id === parameterId ? { ...param, value } : param
      )
    };
    
    setSelectedTemplate(updatedTemplate);
  };
  
  // Generate response
  const handleGenerate = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResult(`Here's a sample Remote Work Policy for a Technology company with 50-500 employees:

# Remote Work Policy for [Company Name]

## Introduction
This Remote Work Policy outlines [Company Name]'s guidelines and expectations for employees working remotely. This policy applies to all eligible employees at [Company Name].

## 1. Eligibility Criteria
- Eligible positions: Software development, design, marketing, and other roles that can be performed remotely
- Performance requirements: Employees must maintain a satisfactory performance rating
- Probationary period: New employees must complete a 3-month probationary period before being eligible
- Manager approval: All remote work arrangements require manager approval

## 2. Equipment and Technology Requirements
- [Company Name] will provide: Laptop computer, necessary software licenses, and basic peripherals
- Employees are responsible for: Maintaining a suitable home office environment and reliable internet connection
- Technical support: IT department will provide remote support during business hours
- Security requirements: All equipment must comply with company security policies

## 3. Communication Protocols
- Core working hours: 10:00 AM - 3:00 PM CET when all remote employees must be available
- Response time expectations: Emails should be responded to within 4 business hours
- Team meetings: Remote employees must attend all scheduled team meetings via video conference
- Status updates: Daily status updates must be submitted through the company project management system

## 4. Performance Measurement
- Goal setting: Managers and employees will establish clear, measurable goals
- Regular check-ins: Weekly one-on-one meetings with direct managers
- Performance reviews: Quarterly performance reviews based on established goals
- Project tracking: All work must be tracked in the company project management system

This policy complies with Nordic labor regulations and may be updated as necessary to reflect changing workplace needs.`);
      setIsLoading(false);
      setActiveTab("results");
    }, 2000);
  };
  
  // Function to apply the template with parameters
  const applyTemplate = () => {
    let newPrompt = selectedTemplate.template;
    
    // Replace parameters in the template with their current values
    selectedTemplate.parameters.forEach(param => {
      newPrompt = newPrompt.replace(`[${param.name}]`, param.value);
    });
    
    setPromptText(newPrompt);
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-8">
        <GradientHeading level={2} className="mb-2">
          Advanced Prompt Playground
        </GradientHeading>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Design, test, and refine prompts with real-time feedback
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="bg-card/50 border-0 shadow-md lg:col-span-1">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Categories */}
            <div className="space-y-2">
              {TEMPLATE_CATEGORIES.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "secondary" : "ghost"}
                  className={`w-full justify-start ${activeCategory === category.id ? 'bg-primary/10' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
            
            <Separator />
            
            {/* Recent Templates */}
            <div>
              <h3 className="font-medium mb-2">Recent</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                  Employee Handbook
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                  Product Description
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <Card className="bg-card/50 border-0 shadow-md lg:col-span-3">
          <CardHeader className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full rounded-t-lg rounded-b-none grid grid-cols-4">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="results">Test Results</TabsTrigger>
                <TabsTrigger value="history">Version History</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="pt-6">
            <TabsContent value="editor" className="mt-0 space-y-6">
              {/* Template Header */}
              <div>
                <h3 className="text-lg font-medium mb-2">{selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>
              
              {/* Parameters Section */}
              <Card className="bg-card/30 border-0">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedTemplate.parameters.map(param => (
                      <div key={param.id} className="space-y-2">
                        <label className="text-sm font-medium">{param.label}</label>
                        <Select
                          value={param.value}
                          onValueChange={(value) => handleParameterChange(param.id, value)}
                        >
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder={`Select ${param.label}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {param.options?.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={applyTemplate}
                      className="text-xs"
                    >
                      Apply Parameters
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Prompt Editor */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter your prompt here..."
                  className="min-h-[200px] bg-background/50 resize-none font-mono text-sm"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
                
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save Draft
                    </Button>
                    <Button variant="outline" size="sm">
                      <BookmarkPlus className="h-4 w-4 mr-1" />
                      Add to Templates
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-primary to-primary-foreground"
                  >
                    {isLoading ? (
                      <>Generating<span className="loading-dots"></span></>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Policy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="mt-0 space-y-4">
              {result ? (
                <div className="rounded-md bg-background/50 p-4">
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">Generate a response to see results here</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="text-center py-16">
                <p className="text-muted-foreground">Your version history will appear here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="mt-0">
              <div className="text-center py-16">
                <p className="text-muted-foreground">Examples will appear here</p>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 