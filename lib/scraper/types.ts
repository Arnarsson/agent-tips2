// lib/scraper/types.ts
// Type definitions for the scraper utilities

import { z } from 'zod';

// Define the structure for scraped content
export interface ScrapedContent {
  title: string;
  url: string;
  sourceName: string;
  sourceUrl: string;
  content: ContentSection[];
  metadata: ContentMetadata;
}

// Define the structure for content sections
export interface ContentSection {
  heading: string;
  paragraphs: string[];
  codeBlocks?: CodeBlock[];
  images?: ImageData[];
}

// Define the structure for code blocks
export interface CodeBlock {
  code: string;
  language?: string;
  caption?: string;
}

// Define the structure for images
export interface ImageData {
  url: string;
  alt?: string;
  caption?: string;
}

// Define the structure for content metadata
export interface ContentMetadata {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  estimatedReadTime: number;
  dateScraped: string;
  lastModified?: string;
  createdAt?: string;
}

// Define the scraper configuration
export interface ScraperConfig {
  url: string;
  selector: string;
  transform?: (html: string) => ScrapedContent;
  metadata?: Partial<ContentMetadata>;
}

// Define the scraper source
export interface ScraperSource {
  name: string;
  baseUrl: string;
  configs: ScraperConfig[];
}

// Zod schema for validation
export const ScrapedContentSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  sourceName: z.string(),
  sourceUrl: z.string().url(),
  content: z.array(
    z.object({
      heading: z.string(),
      paragraphs: z.array(z.string()),
      codeBlocks: z
        .array(
          z.object({
            code: z.string(),
            language: z.string().optional(),
            caption: z.string().optional(),
          })
        )
        .optional(),
      images: z
        .array(
          z.object({
            url: z.string().url(),
            alt: z.string().optional(),
            caption: z.string().optional(),
          })
        )
        .optional(),
    })
  ),
  metadata: z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    topics: z.array(z.string()),
    estimatedReadTime: z.number().positive(),
    dateScraped: z.string().datetime(),
    lastModified: z.string().datetime().optional(),
    createdAt: z.string().datetime().optional(),
  }),
});

// Learning content type converted from scraped content
export interface LearningContent extends ScrapedContent {
  id: string;
  slug: string;
  examples?: LearningExample[];
  exercises?: LearningExercise[];
}

// Learning example derived from content
export interface LearningExample {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  explanation: string;
  type: string;
}

// Learning exercise derived from content
export interface LearningExercise {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'rewrite' | 'free-form';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  hints?: string[];
} 