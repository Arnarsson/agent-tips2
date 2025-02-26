"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Exercise, ExerciseType } from "@/lib/types";
import { CheckCircle, ChevronDown, ChevronUp, HelpCircle, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    setIsSubmitted(true);
    setShowExplanation(true);
  };

  const renderExerciseContent = () => {
    switch (exercise.type) {
      case "fill-in-blank":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {exercise.content.template.split("{{blank}}").map((part, index, array) => (
                <React.Fragment key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="inline-block min-w-[100px] px-1 mx-1 border-b-2 border-primary">
                      {isSubmitted ? (
                        <span className={userAnswer === exercise.content.correctAnswer ? "text-green-500" : "text-red-500"}>
                          {userAnswer || "___________"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">___________</span>
                      )}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <Textarea
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              className="min-h-[100px]"
            />
            
            {isSubmitted && (
              <div className="p-3 border rounded-md bg-card">
                <div className="flex items-center">
                  {userAnswer === exercise.content.correctAnswer ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="font-medium text-green-500">Correct!</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="font-medium text-red-500">
                        Not quite. The correct answer is: {exercise.content.correctAnswer}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {exercise.content.question}
            </div>
            
            <RadioGroup
              value={selectedOption || ""}
              onValueChange={setSelectedOption}
              disabled={isSubmitted}
            >
              {exercise.content.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-2 p-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className={`cursor-pointer ${
                      isSubmitted && option === exercise.content.correctAnswer
                        ? "text-green-500 font-medium"
                        : isSubmitted && option === selectedOption
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {isSubmitted && selectedOption !== exercise.content.correctAnswer && (
              <div className="p-3 border rounded-md bg-card">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="font-medium text-red-500">
                    Not quite. The correct answer is: {exercise.content.correctAnswer}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
        
      case "rewrite":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Original Prompt:</h3>
              <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                {exercise.content.originalPrompt}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Your Improved Version:</h3>
              <Textarea
                placeholder="Rewrite the prompt to make it more effective..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isSubmitted}
                className="min-h-[150px]"
              />
            </div>
            
            {isSubmitted && (
              <div>
                <h3 className="text-sm font-medium mb-2">Example Solution:</h3>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {exercise.content.exampleSolution}
                </div>
              </div>
            )}
          </div>
        );
        
      case "free-form":
      default:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {exercise.content.prompt}
            </div>
            
            <Textarea
              placeholder="Write your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              className="min-h-[150px]"
            />
            
            {isSubmitted && exercise.content.sampleSolution && (
              <div>
                <h3 className="text-sm font-medium mb-2">Sample Solution:</h3>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {exercise.content.sampleSolution}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{exercise.title}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="mr-1">
                {exercise.difficulty}
              </Badge>
              <Badge variant="secondary" className="mr-1">
                {exercise.category}
              </Badge>
              <Badge variant="secondary" className="mr-1">
                {exercise.type}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{exercise.description}</p>
        
        {renderExerciseContent()}
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center text-xs"
            onClick={() => setShowHint(!showHint)}
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            {showHint ? "Hide hint" : "Show hint"}
          </Button>
          
          {!isSubmitted && (
            <Button onClick={handleSubmit} disabled={exercise.type === "multiple-choice" && !selectedOption}>
              Submit
            </Button>
          )}
        </div>
        
        {showHint && exercise.content.hint && (
          <div className="p-3 border rounded-md bg-card">
            <p className="font-medium text-sm">Hint:</p>
            <p className="text-sm text-muted-foreground mt-1">{exercise.content.hint}</p>
          </div>
        )}
      </CardContent>
      
      {exercise.content.explanation && (
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
              {exercise.content.explanation}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ExerciseCard; 