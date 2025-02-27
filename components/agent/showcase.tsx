"use client"

import { useState } from "react"
import { ArrowRight, Check, Info, Layers, Palette, Animation, Layout, Component, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import { FadeIn } from "./fade-in"
import { GradientHeading } from "./gradient-heading"
import { PopIn } from "./pop-in"
import * as ResizablePanel from "./resizable-panel"
import { TextureButton } from "./texture-button"
import {
  TextureCard,
  TextureCardContent,
  TextureCardDescription,
  TextureCardFooter,
  TextureCardHeader,
  TextureCardPrimary,
  TextureCardTitle,
  TextureSeparator,
} from "./texture-card"
import { AgentTipsLogo } from "./logo"

export function ComponentShowcase() {
  const [activePanel, setActivePanel] = useState("panel1")
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <FadeIn>
        <div className="text-center mb-12">
          <GradientHeading size="lg" weight="bold">
            Agent.tips Component Showcase
          </GradientHeading>
          
          <div className="flex items-center justify-center gap-3 mt-4">
            <AgentTipsLogo className="size-8 text-primary" />
            <GradientHeading size="xs" variant="subtext">
              Design System & Component Library
            </GradientHeading>
          </div>
          
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            This showcase demonstrates the core UI components used throughout the Agent.tips application.
            Use these components to maintain consistency and follow our design principles.
          </p>
        </div>
      </FadeIn>
      
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Layout className="size-4" />
            <span>Cards & Containers</span>
          </TabsTrigger>
          <TabsTrigger value="buttons" className="flex items-center gap-2">
            <Component className="size-4" />
            <span>Buttons & Controls</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Palette className="size-4" />
            <span>Typography</span>
          </TabsTrigger>
          <TabsTrigger value="animations" className="flex items-center gap-2">
            <Animation className="size-4" />
            <span>Animations</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="space-y-6">
          <GradientHeading size="sm" variant="secondary">Cards & Containers</GradientHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TextureCard Showcase */}
            <TextureCardPrimary>
              <TextureCardHeader className="px-6 pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <TextureCardTitle>Primary Texture Card</TextureCardTitle>
                    <TextureCardDescription>
                      A card component with primary styling and texture effects
                    </TextureCardDescription>
                  </div>
                  <Badge variant="outline">Primary</Badge>
                </div>
              </TextureCardHeader>
              <TextureCardContent>
                <p>This is the content of the primary card. Use this for featured content or important information.</p>
              </TextureCardContent>
              <TextureSeparator />
              <TextureCardFooter>
                <TextureButton variant="minimal" size="sm">
                  Cancel
                </TextureButton>
                <TextureButton size="sm">
                  Save
                </TextureButton>
              </TextureCardFooter>
            </TextureCardPrimary>
            
            <TextureCard>
              <TextureCardHeader className="px-6 pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <TextureCardTitle>Standard Texture Card</TextureCardTitle>
                    <TextureCardDescription>
                      A standard card component with texture effects
                    </TextureCardDescription>
                  </div>
                  <Badge variant="outline">Standard</Badge>
                </div>
              </TextureCardHeader>
              <TextureCardContent>
                <p>This is the content of the standard card. Use this for most content throughout the application.</p>
              </TextureCardContent>
              <TextureSeparator />
              <TextureCardFooter>
                <TextureButton variant="minimal" size="sm">
                  Cancel
                </TextureButton>
                <TextureButton variant="secondary" size="sm">
                  Save
                </TextureButton>
              </TextureCardFooter>
            </TextureCard>
            
            <TextureCard className="md:col-span-2">
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Card Variations & Usage</TextureCardTitle>
                <TextureCardDescription>
                  Guidelines for using different card styles
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Primary Cards</h4>
                    <p className="text-sm text-muted-foreground">Use for featured content, main actions, or to highlight important information.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Standard Cards</h4>
                    <p className="text-sm text-muted-foreground">Use for most content throughout the application, secondary information, or supporting details.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Card Anatomy</h4>
                    <p className="text-sm text-muted-foreground">Cards typically include a header, content area, optional separator, and footer for actions.</p>
                  </div>
                </div>
              </TextureCardContent>
            </TextureCard>
          </div>
        </TabsContent>
        
        <TabsContent value="buttons" className="space-y-6">
          <GradientHeading size="sm" variant="secondary">Buttons & Controls</GradientHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TextureButton Showcase */}
            <TextureCard>
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Texture Buttons</TextureCardTitle>
                <TextureCardDescription>
                  Various button styles for different contexts
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Primary Variants</p>
                    <div className="flex flex-wrap gap-2">
                      <TextureButton>Primary</TextureButton>
                      <TextureButton variant="secondary">Secondary</TextureButton>
                      <TextureButton variant="accent">Accent</TextureButton>
                      <TextureButton variant="destructive">Destructive</TextureButton>
                      <TextureButton variant="minimal">Minimal</TextureButton>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Sizes</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <TextureButton size="sm">Small</TextureButton>
                      <TextureButton>Default</TextureButton>
                      <TextureButton size="lg">Large</TextureButton>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Icon Buttons</p>
                    <div className="flex gap-2">
                      <TextureButton variant="icon" size="icon">
                        <Check className="size-4" />
                      </TextureButton>
                      <TextureButton variant="icon" size="icon">
                        <Info className="size-4" />
                      </TextureButton>
                      <TextureButton variant="secondary" size="icon">
                        <ArrowRight className="size-4" />
                      </TextureButton>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">With Icons</p>
                    <div className="flex flex-wrap gap-2">
                      <TextureButton>
                        <Check className="mr-2 size-4" /> Save
                      </TextureButton>
                      <TextureButton variant="secondary">
                        Next <ChevronRight className="ml-2 size-4" />
                      </TextureButton>
                    </div>
                  </div>
                </div>
              </TextureCardContent>
            </TextureCard>
            
            <TextureCard>
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Standard UI Controls</TextureCardTitle>
                <TextureCardDescription>
                  Basic UI controls from the component library
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Standard Buttons</p>
                    <div className="flex flex-wrap gap-2">
                      <Button>Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge variant="outline">Outline</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Separators</p>
                    <div className="space-y-2">
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <div>Left</div>
                        <Separator orientation="vertical" className="h-4" />
                        <div>Right</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TextureCardContent>
            </TextureCard>
          </div>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-6">
          <GradientHeading size="sm" variant="secondary">Typography</GradientHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gradient Heading Showcase */}
            <TextureCard>
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Gradient Headings</TextureCardTitle>
                <TextureCardDescription>
                  Various heading styles with gradient effects
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="space-y-6">
                  <div>
                    <GradientHeading size="lg">Large Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">Used for page titles and major sections</p>
                  </div>
                  
                  <div>
                    <GradientHeading size="md">Medium Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">Used for section headings</p>
                  </div>
                  
                  <div>
                    <GradientHeading size="sm">Small Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">Used for subsections and card titles</p>
                  </div>
                  
                  <div>
                    <GradientHeading size="xs">Extra Small Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">Used for minor headings and labels</p>
                  </div>
                </div>
              </TextureCardContent>
            </TextureCard>
            
            <TextureCard>
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Heading Variants</TextureCardTitle>
                <TextureCardDescription>
                  Different color variants for headings
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="space-y-4">
                  <div>
                    <GradientHeading size="xs">Default Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">Primary gradient style</p>
                  </div>
                  
                  <div>
                    <GradientHeading size="xs" variant="pink">Pink Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">For emphasis and highlighting</p>
                  </div>
                  
                  <div>
                    <GradientHeading size="xs" variant="light">Light Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">For use on dark backgrounds</p>
                  </div>
                  
                  <div>
                    <GradientHeading size="xs" variant="secondary">Secondary Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">For secondary information</p>
                  </div>
                  
                  <div>
                    <GradientHeading size="xs" variant="subtext">Subtext Heading</GradientHeading>
                    <p className="text-sm text-muted-foreground mt-1">For subtitles and supporting text</p>
                  </div>
                </div>
              </TextureCardContent>
            </TextureCard>
            
            <TextureCard className="md:col-span-2">
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Text Styles</TextureCardTitle>
                <TextureCardDescription>
                  Standard text styles and usage guidelines
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">Heading 1</h3>
                      <p className="text-sm text-muted-foreground">24px, Bold</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold">Heading 2</h4>
                      <p className="text-sm text-muted-foreground">18px, Semibold</p>
                    </div>
                    
                    <div>
                      <h5 className="text-base font-medium">Heading 3</h5>
                      <p className="text-sm text-muted-foreground">16px, Medium</p>
                    </div>
                    
                    <div>
                      <h6 className="text-sm font-medium">Heading 4</h6>
                      <p className="text-sm text-muted-foreground">14px, Medium</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-base">Body Text</p>
                      <p className="text-sm text-muted-foreground">16px, Regular - Main content text</p>
                    </div>
                    
                    <div>
                      <p className="text-sm">Small Text</p>
                      <p className="text-sm text-muted-foreground">14px, Regular - Secondary content</p>
                    </div>
                    
                    <div>
                      <p className="text-xs">Extra Small Text</p>
                      <p className="text-sm text-muted-foreground">12px, Regular - Captions, labels</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Muted Text</p>
                      <p className="text-sm text-muted-foreground">Used for less important information</p>
                    </div>
                  </div>
                </div>
              </TextureCardContent>
            </TextureCard>
          </div>
        </TabsContent>
        
        <TabsContent value="animations" className="space-y-6">
          <GradientHeading size="sm" variant="secondary">Animations</GradientHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Animation Components Showcase */}
            <TextureCard>
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Animation Components</TextureCardTitle>
                <TextureCardDescription>
                  FadeIn and PopIn components for smooth transitions
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="space-y-4">
                  <Button onClick={() => setActivePanel(activePanel === "panel1" ? "panel2" : "panel1")}>
                    Toggle Panel Content
                  </Button>
                  
                  <ResizablePanel.Root value={activePanel} className="mt-4">
                    <ResizablePanel.Content value="panel1">
                      <PopIn>
                        <div className="p-4 bg-muted rounded-lg">
                          <h3 className="font-medium">PopIn Animation</h3>
                          <p className="text-sm text-muted-foreground">This content animates with a pop effect. Use for elements that should draw attention.</p>
                        </div>
                      </PopIn>
                    </ResizablePanel.Content>
                    <ResizablePanel.Content value="panel2">
                      <FadeIn>
                        <div className="p-4 bg-muted rounded-lg">
                          <h3 className="font-medium">FadeIn Animation</h3>
                          <p className="text-sm text-muted-foreground">This content fades in smoothly. Use for subtle transitions and most content.</p>
                        </div>
                      </FadeIn>
                    </ResizablePanel.Content>
                  </ResizablePanel.Root>
                </div>
              </TextureCardContent>
            </TextureCard>
            
            <TextureCard>
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Resizable Panel</TextureCardTitle>
                <TextureCardDescription>
                  Smooth transitions between different content panels
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant={activePanel === "panel1" ? "default" : "outline"} 
                      onClick={() => setActivePanel("panel1")}
                    >
                      Panel 1
                    </Button>
                    <Button 
                      variant={activePanel === "panel2" ? "default" : "outline"} 
                      onClick={() => setActivePanel("panel2")}
                    >
                      Panel 2
                    </Button>
                  </div>
                  
                  <ResizablePanel.Root value={activePanel} className="mt-4">
                    <ResizablePanel.Content value="panel1">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium">First Panel</h3>
                        <p className="text-sm text-muted-foreground">
                          The ResizablePanel component smoothly animates between different content states,
                          maintaining a natural feel as content changes.
                        </p>
                      </div>
                    </ResizablePanel.Content>
                    <ResizablePanel.Content value="panel2">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium">Second Panel</h3>
                        <p className="text-sm text-muted-foreground">
                          Use this component when switching between different views or states
                          within the same container. It provides a smooth transition that maintains context.
                        </p>
                      </div>
                    </ResizablePanel.Content>
                  </ResizablePanel.Root>
                </div>
              </TextureCardContent>
            </TextureCard>
            
            <TextureCard className="md:col-span-2">
              <TextureCardHeader className="px-6 pt-6">
                <TextureCardTitle>Animation Guidelines</TextureCardTitle>
                <TextureCardDescription>
                  Best practices for using animations in the application
                </TextureCardDescription>
              </TextureCardHeader>
              <TextureCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Purpose</h4>
                    <p className="text-sm text-muted-foreground">
                      Use animations purposefully to guide users, provide feedback, and create a polished experience.
                      Avoid animations that distract or delay user interactions.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Optimize animations for performance. Use hardware-accelerated properties (transform, opacity)
                      and keep animations short (150-300ms) for a responsive feel.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Accessibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Respect user preferences for reduced motion. Provide alternatives or simplified animations
                      for users who have enabled reduced motion settings.
                    </p>
                  </div>
                </div>
              </TextureCardContent>
            </TextureCard>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 text-center">
        <GradientHeading size="xs" variant="subtext">
          Agent.tips Design System
        </GradientHeading>
        <p className="text-sm text-muted-foreground mt-2">
          Use these components consistently throughout the application to maintain a cohesive user experience.
        </p>
      </div>
    </div>
  )
} 