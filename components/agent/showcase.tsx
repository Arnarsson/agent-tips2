"use client"

import { useState } from "react"
import { ArrowRight, Check, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <FadeIn>
        <GradientHeading size="lg" weight="bold">
          Agent.tips Component Showcase
        </GradientHeading>
        
        <div className="flex items-center justify-center gap-3 mt-4">
          <AgentTipsLogo className="size-8 text-primary" />
          <GradientHeading size="xs" variant="subtext">
            Rebranded Components
          </GradientHeading>
        </div>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TextureCard Showcase */}
        <TextureCardPrimary>
          <TextureCardHeader className="px-6 pt-6">
            <TextureCardTitle>Texture Card</TextureCardTitle>
            <TextureCardDescription>
              A card component with texture effects
            </TextureCardDescription>
          </TextureCardHeader>
          <TextureCardContent>
            <p>This is the content of the card.</p>
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
        
        {/* TextureButton Showcase */}
        <TextureCard>
          <TextureCardHeader className="px-6 pt-6">
            <TextureCardTitle>Texture Buttons</TextureCardTitle>
            <TextureCardDescription>
              Various button styles
            </TextureCardDescription>
          </TextureCardHeader>
          <TextureCardContent>
            <div className="space-y-3">
              <TextureButton>Primary</TextureButton>
              <TextureButton variant="secondary">Secondary</TextureButton>
              <TextureButton variant="accent">Accent</TextureButton>
              <TextureButton variant="destructive">Destructive</TextureButton>
              <TextureButton variant="minimal">Minimal</TextureButton>
              <div className="flex gap-2">
                <TextureButton variant="icon" size="icon">
                  <Check className="size-4" />
                </TextureButton>
                <TextureButton variant="icon" size="icon">
                  <Info className="size-4" />
                </TextureButton>
              </div>
            </div>
          </TextureCardContent>
        </TextureCard>
        
        {/* Gradient Heading Showcase */}
        <TextureCard>
          <TextureCardHeader className="px-6 pt-6">
            <TextureCardTitle>Gradient Headings</TextureCardTitle>
            <TextureCardDescription>
              Various heading styles
            </TextureCardDescription>
          </TextureCardHeader>
          <TextureCardContent>
            <div className="space-y-4">
              <GradientHeading size="xs">Default Heading</GradientHeading>
              <GradientHeading size="xs" variant="pink">Pink Heading</GradientHeading>
              <GradientHeading size="xs" variant="light">Light Heading</GradientHeading>
              <GradientHeading size="xs" variant="secondary">Secondary Heading</GradientHeading>
              <GradientHeading size="xs" variant="subtext">Subtext Heading</GradientHeading>
            </div>
          </TextureCardContent>
        </TextureCard>
        
        {/* Animation Components Showcase */}
        <TextureCard>
          <TextureCardHeader className="px-6 pt-6">
            <TextureCardTitle>Animation Components</TextureCardTitle>
            <TextureCardDescription>
              FadeIn and PopIn components
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
                      <h3 className="font-medium">Panel 1 Content</h3>
                      <p className="text-sm text-muted-foreground">This content animates in and out.</p>
                    </div>
                  </PopIn>
                </ResizablePanel.Content>
                <ResizablePanel.Content value="panel2">
                  <FadeIn>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-medium">Panel 2 Content</h3>
                      <p className="text-sm text-muted-foreground">Different animation style.</p>
                    </div>
                  </FadeIn>
                </ResizablePanel.Content>
              </ResizablePanel.Root>
            </div>
          </TextureCardContent>
        </TextureCard>
      </div>
    </div>
  )
} 