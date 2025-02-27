"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useSavedPrompts } from "@/lib/contexts/saved-prompts-context";
import { SavedPrompt } from "@/lib/types";
import { 
  Search, 
  Copy, 
  Trash2, 
  Edit, 
  Tag, 
  Clock, 
  Star, 
  Filter, 
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedPromptsList() {
  const { savedPrompts, deletePrompt, updatePrompt } = useSavedPrompts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [expandedPromptId, setExpandedPromptId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get all unique tags from saved prompts
  const allTags = Array.from(
    new Set(savedPrompts.flatMap(prompt => prompt.tags))
  ).sort();

  // Filter prompts based on search query and selected tags
  const filteredPrompts = savedPrompts.filter(prompt => {
    const matchesSearch = searchQuery === "" || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => prompt.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Toggle tag selection for filtering
  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  // Copy prompt to clipboard
  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard."
    });
  };

  // Start editing a prompt
  const startEditing = (prompt: SavedPrompt) => {
    setEditingPrompt(prompt);
    setEditTitle(prompt.title);
    setEditTags(prompt.tags.join(", "));
  };

  // Save edited prompt
  const saveEditedPrompt = () => {
    if (editingPrompt) {
      const tagArray = editTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      updatePrompt(editingPrompt.id, {
        title: editTitle,
        tags: tagArray,
      });
      
      setEditingPrompt(null);
      
      toast({
        title: "Prompt updated",
        description: "Your prompt has been updated successfully."
      });
    }
  };

  // Toggle prompt expansion
  const togglePromptExpansion = (id: string) => {
    setExpandedPromptId(prev => prev === id ? null : id);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {selectedTags.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 gap-1"
            >
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          )}
          
          {allTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTagFilter(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {filteredPrompts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">No prompts found</h3>
              <p className="max-w-md">
                {savedPrompts.length === 0 
                  ? "You haven't saved any prompts yet. Try creating and saving prompts from the Prompt Playground."
                  : "No prompts match your current filters. Try adjusting your search or clearing filters."}
              </p>
              {savedPrompts.length > 0 && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPrompts.length} of {savedPrompts.length} saved prompts
          </p>
          
          <AnimatePresence>
            {filteredPrompts.map((prompt) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => copyPrompt(prompt.content)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => startEditing(prompt)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this prompt?")) {
                              deletePrompt(prompt.id);
                              toast({
                                title: "Prompt deleted",
                                description: "Your prompt has been deleted."
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {prompt.templateId && (
                        <Badge variant="secondary">
                          {PROMPT_TEMPLATES.find(t => t.id === prompt.templateId)?.name || prompt.templateId}
                        </Badge>
                      )}
                      
                      {prompt.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Created: {formatDate(prompt.createdAt)}</span>
                      </div>
                      
                      {prompt.metrics?.usageCount !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>Used: {prompt.metrics.usageCount} times</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div 
                      className={`relative bg-muted p-3 rounded-md text-sm whitespace-pre-wrap ${
                        expandedPromptId !== prompt.id && "max-h-24 overflow-hidden"
                      }`}
                    >
                      {prompt.content}
                      
                      {expandedPromptId !== prompt.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-muted to-transparent" />
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => togglePromptExpansion(prompt.id)}
                    >
                      {expandedPromptId === prompt.id ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show more
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Edit Prompt Dialog */}
      <Dialog open={!!editingPrompt} onOpenChange={(open) => !open && setEditingPrompt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>
              Update the title and tags for your saved prompt.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter a title for your prompt"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input 
                value={editTags} 
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="e.g. creative, storytelling, technical"
              />
            </div>
            
            {editingPrompt && (
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-2">Prompt Preview</h4>
                <p className="text-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {editingPrompt.content.substring(0, 100)}
                  {editingPrompt.content.length > 100 ? "..." : ""}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPrompt(null)}>
              Cancel
            </Button>
            <Button onClick={saveEditedPrompt} disabled={!editTitle.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sample prompt templates for display purposes
const PROMPT_TEMPLATES = [
  { id: "zero-shot", name: "Zero-shot" },
  { id: "few-shot", name: "Few-shot" },
  { id: "chain-of-thought", name: "Chain of Thought" },
  { id: "persona", name: "Persona-based" },
  { id: "custom", name: "Custom" }
]; 