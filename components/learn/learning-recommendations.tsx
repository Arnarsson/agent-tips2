"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Lightbulb, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Star,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";

export interface RecommendationItem {
  id: string;
  title: string;
  type: "example" | "exercise" | "guide";
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  tags: string[];
  reason: string;
}

interface LearningRecommendationsProps {
  recommendations: RecommendationItem[];
  onSelectRecommendation: (id: string) => void;
}

export const LearningRecommendations: React.FC<LearningRecommendationsProps> = ({
  recommendations,
  onSelectRecommendation
}) => {
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
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-500 bg-green-500/10";
      case "intermediate":
        return "text-blue-500 bg-blue-500/10";
      case "advanced":
        return "text-purple-500 bg-purple-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };
  
  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "example":
        return <BookOpen className="h-4 w-4" />;
      case "exercise":
        return <Star className="h-4 w-4" />;
      case "guide":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Recommended for You
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {recommendations.length} items
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <motion.div 
                  key={recommendation.id}
                  variants={itemVariants}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        {getTypeIcon(recommendation.type)}
                      </div>
                      <h3 className="font-medium">{recommendation.title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(recommendation.difficulty)}>
                        {recommendation.difficulty}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recommendation.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    <span className="font-medium text-primary">Why: </span>
                    {recommendation.reason}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {recommendation.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 group"
                      onClick={() => onSelectRecommendation(recommendation.id)}
                    >
                      <span>Start Learning</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Complete more exercises to get personalized recommendations.
              </p>
            </div>
          )}
          
          <Button variant="outline" className="w-full mt-2">
            View All Recommendations
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LearningRecommendations; 