"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, BookOpen, Code, Dumbbell, ArrowRight, Filter } from "lucide-react";
import PromptEngineeringGuide from "./guide";
import BeforeAfterExampleCard from "./before-after-example";
import ExerciseCard from "./exercise-card";
import { sampleExamples } from "@/lib/data/examples";
import { sampleExercises } from "@/lib/data/exercises";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";

export function LearningSections() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExamples, setFilteredExamples] = useState(sampleExamples);
  const [filteredExercises, setFilteredExercises] = useState(sampleExercises);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Extract all unique tags and categories
  const allTags = Array.from(new Set(sampleExamples.flatMap(example => example.tags)));
  const allCategories = Array.from(new Set(sampleExamples.map(example => example.category)));

  // Filter examples and exercises based on search query and filters
  useEffect(() => {
    if (searchQuery || selectedTags.length > 0 || selectedCategories.length > 0) {
      const lowercaseQuery = searchQuery.toLowerCase();
      
      const filteredExs = sampleExamples.filter(example => {
        const matchesSearch = lowercaseQuery === '' || 
          example.title.toLowerCase().includes(lowercaseQuery) || 
          example.before.prompt.toLowerCase().includes(lowercaseQuery) ||
          example.after.prompt.toLowerCase().includes(lowercaseQuery);
        
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.some(tag => example.tags.includes(tag));
        
        const matchesCategory = selectedCategories.length === 0 || 
          selectedCategories.includes(example.category);
        
        return matchesSearch && matchesTags && matchesCategory;
      });
      
      setFilteredExamples(filteredExs);
      
      // Also filter exercises (simplified for now)
      const filteredExs2 = sampleExercises.filter(exercise => 
        lowercaseQuery === '' || 
        exercise.title.toLowerCase().includes(lowercaseQuery)
      );
      
      setFilteredExercises(filteredExs2);
    } else {
      setFilteredExamples(sampleExamples);
      setFilteredExercises(sampleExercises);
    }
  }, [searchQuery, selectedTags, selectedCategories]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCategories([]);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <TabsList className="grid w-full md:w-auto grid-cols-4 mb-4 md:mb-0">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 hidden md:inline" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 hidden md:inline" />
            <span>Guide</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <Code className="h-4 w-4 hidden md:inline" />
            <span>Examples</span>
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 hidden md:inline" />
            <span>Exercises</span>
          </TabsTrigger>
        </TabsList>
        
        {(activeTab === "examples" || activeTab === "exercises") && (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="md:ml-2"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {showFilters && (activeTab === "examples" || activeTab === "exercises") && (
        <div className="mb-6 p-4 border rounded-md bg-muted/30 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <h3 className="text-sm font-medium mb-2 md:mb-0">Filters</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {allCategories.map(category => (
                  <Badge 
                    key={category}
                    variant={selectedCategories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium mb-2 text-muted-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <TabsContent value="overview" className="space-y-6 mt-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md">
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md">
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full transition-all hover:shadow-md">
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
          </motion.div>
        </motion.div>

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
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={() => setActiveTab("guide")} 
              className="group"
            >
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="guide" className="space-y-6 mt-6">
        <PromptEngineeringGuide />
      </TabsContent>

      <TabsContent value="examples" className="space-y-8 mt-6">
        {filteredExamples.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredExamples.map((example) => (
              <motion.div key={example.id} variants={itemVariants}>
                <BeforeAfterExampleCard example={example} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No examples match your search criteria.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="exercises" className="space-y-8 mt-6">
        {filteredExercises.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredExercises.map((exercise) => (
              <motion.div key={exercise.id} variants={itemVariants}>
                <ExerciseCard exercise={exercise} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No exercises match your search criteria.</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default LearningSections; 