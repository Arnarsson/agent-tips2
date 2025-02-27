"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Award, Zap, CheckCircle, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProgress } from "@/lib/contexts/UserProgressProvider";

export default function HomePage() {
  // Try to use the UserProgress context, but provide fallback values if it's not available
  let userProgressData = {
    fundamentalsProgress: { totalExamples: 0, totalExercises: 0, completedExamples: 0, completedExercises: 0 },
    ethicsProgress: { totalExamples: 0, totalExercises: 0, completedExamples: 0, completedExercises: 0 },
    implementationProgress: { totalExamples: 0, totalExercises: 0, completedExamples: 0, completedExercises: 0 },
    overallProgress: 0
  };
  
  try {
    userProgressData = useUserProgress();
  } catch (error) {
    console.log("UserProgressProvider not available, using default values");
  }
  
  const { fundamentalsProgress, ethicsProgress, implementationProgress, overallProgress } = userProgressData;
  
  // Calculate total completed examples and exercises across all phases
  const totalExamples = fundamentalsProgress.totalExamples + ethicsProgress.totalExamples + implementationProgress.totalExamples;
  const totalExercises = fundamentalsProgress.totalExercises + ethicsProgress.totalExercises + implementationProgress.totalExercises;
  const completedExamples = fundamentalsProgress.completedExamples + ethicsProgress.completedExamples + implementationProgress.completedExamples;
  const completedExercises = fundamentalsProgress.completedExercises + ethicsProgress.completedExercises + implementationProgress.completedExercises;
  
  const totalCompleted = completedExamples + completedExercises;
  const hasStarted = totalCompleted > 0;
  
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

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Interactive Examples",
      description: "Learn from real-world examples with before and after comparisons."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Hands-on Exercises",
      description: "Practice your skills with interactive exercises and get immediate feedback."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Achievement System",
      description: "Track your progress and earn achievements as you master new skills."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Community Learning",
      description: "Join a community of prompt engineers and share your knowledge."
    }
  ];

  const testimonials = [
    {
      quote: "This academy transformed how I communicate with AI systems. My prompts are now more effective and precise.",
      author: "Alex Chen, Product Manager"
    },
    {
      quote: "The interactive exercises helped me understand the nuances of prompt engineering that I couldn't grasp from articles alone.",
      author: "Sarah Johnson, UX Designer"
    },
    {
      quote: "I've seen a 40% improvement in the quality of AI responses since applying the techniques I learned here.",
      author: "Michael Rodriguez, Developer"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            variants={itemVariants}
          >
            Prompt Engineering Academy
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10"
            variants={itemVariants}
          >
            Master the art of communicating with AI systems effectively
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/learn">
              <Button size="lg" className="rounded-full px-8">
                {hasStarted ? "Continue Learning" : "Start Learning"} 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          
          {hasStarted && (
            <motion.div 
              className="mt-8 bg-primary/10 rounded-lg p-4 inline-block"
              variants={itemVariants}
            >
              <p className="text-sm font-medium">
                You've completed {totalCompleted} of {totalExamples + totalExercises} lessons!
              </p>
              <div className="w-full bg-background/50 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${Math.round((totalCompleted / (totalExamples + totalExercises)) * 100)}%` }}
                ></div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Learn With Us?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our academy provides everything you need to become an expert prompt engineer
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-lg p-6 shadow-sm border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-4">What You'll Learn</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive curriculum to help you master prompt engineering
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Fundamentals</h3>
                <ul className="space-y-3">
                  {[
                    "Understanding AI language models",
                    "Basic prompt structure and components",
                    "Common pitfalls and how to avoid them",
                    "Prompt testing and iteration"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-4">Advanced Techniques</h3>
                <ul className="space-y-3">
                  {[
                    "Role-based prompting strategies",
                    "Chain-of-thought and reasoning",
                    "Context management for complex tasks",
                    "Specialized prompts for different domains"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands who have improved their AI interaction skills
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-lg p-6 shadow-sm border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <p className="text-sm font-medium">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/10">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Master Prompt Engineering?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Start your journey today and transform how you interact with AI
          </p>
          <Link href="/learn">
            <Button size="lg" className="rounded-full px-8">
              Begin Your Learning Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Agent.tips - Prompt Engineering Academy
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Designed to help you master the art of communicating with AI systems effectively.
          </p>
        </div>
      </footer>
    </div>
  );
}
