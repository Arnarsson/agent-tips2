// lib/scraper/storage.ts
// Storage utility for persisting scraped content and learning materials

import fs from 'fs';
import path from 'path';
import { ScrapedContent, LearningContent } from './types';

// Define paths for storing data
const DATA_DIR = path.join(process.cwd(), 'data');
const SCRAPED_CONTENT_DIR = path.join(DATA_DIR, 'scraped-content');
const LEARNING_CONTENT_DIR = path.join(DATA_DIR, 'learning-content');

/**
 * Initializes data directories for storing scraped and learning content
 */
export function initDataDirectories(): void {
  // Create data directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
    console.log(`Created data directory: ${DATA_DIR}`);
  }

  // Create scraped content directory if it doesn't exist
  if (!fs.existsSync(SCRAPED_CONTENT_DIR)) {
    fs.mkdirSync(SCRAPED_CONTENT_DIR);
    console.log(`Created scraped content directory: ${SCRAPED_CONTENT_DIR}`);
  }

  // Create learning content directory if it doesn't exist
  if (!fs.existsSync(LEARNING_CONTENT_DIR)) {
    fs.mkdirSync(LEARNING_CONTENT_DIR);
    console.log(`Created learning content directory: ${LEARNING_CONTENT_DIR}`);
  }
}

/**
 * Saves scraped content to a JSON file
 * @param content ScrapedContent object to save
 * @returns Path to the saved file
 */
export function saveScrapedContent(content: ScrapedContent): string {
  // Initialize directories
  initDataDirectories();

  // Generate filename based on content title
  const filename = generateFilename(content.title) + '.json';
  const filePath = path.join(SCRAPED_CONTENT_DIR, filename);

  // Write content to file
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');

  return filePath;
}

/**
 * Saves learning content to a JSON file
 * @param content LearningContent object to save
 * @returns Path to the saved file
 */
export function saveLearningContent(content: LearningContent): string {
  // Initialize directories
  initDataDirectories();

  // Use content ID as filename
  const filename = `${content.id}.json`;
  const filePath = path.join(LEARNING_CONTENT_DIR, filename);

  // Write content to file
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');

  return filePath;
}

/**
 * Saves multiple learning content items
 * @param contentItems Array of LearningContent objects to save
 * @returns Array of file paths where the content was saved
 */
export function saveLearningContents(contentItems: LearningContent[]): string[] {
  return contentItems.map(content => saveLearningContent(content));
}

/**
 * Loads all learning content from the directory
 * @returns Array of LearningContent objects
 */
export function loadAllLearningContent(): LearningContent[] {
  // Initialize directories
  initDataDirectories();

  // Read all files in the learning content directory
  const files = fs.readdirSync(LEARNING_CONTENT_DIR);
  
  // Filter for JSON files
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  // Load content from each file
  return jsonFiles.map(file => {
    const filePath = path.join(LEARNING_CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as LearningContent;
  });
}

/**
 * Loads learning content by ID
 * @param id ID of the learning content to load
 * @returns LearningContent object or null if not found
 */
export function loadLearningContentById(id: string): LearningContent | null {
  // Initialize directories
  initDataDirectories();

  // Construct file path
  const filePath = path.join(LEARNING_CONTENT_DIR, `${id}.json`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  // Read and parse file
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as LearningContent;
}

/**
 * Generates a sanitized filename from a title
 * @param title Original title
 * @returns Sanitized filename
 */
export function generateFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
}

/**
 * Generates an index file for all learning content
 * @returns Path to the index file
 */
export function generateLearningContentIndex(): string {
  // Load all learning content
  const allContent = loadAllLearningContent();
  
  // Create index with minimal information
  const index = allContent.map(content => ({
    id: content.id,
    title: content.title,
    slug: content.slug,
    difficulty: content.metadata.difficulty,
    topics: content.metadata.topics,
    sourceUrl: content.sourceUrl,
    sourceName: content.sourceName,
    examplesCount: content.examples?.length || 0,
    exercisesCount: content.exercises?.length || 0,
    createdAt: content.metadata.createdAt,
  }));
  
  // Save index to file
  const indexPath = path.join(DATA_DIR, 'learning-content-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
  
  return indexPath;
} 