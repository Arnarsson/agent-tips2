#!/usr/bin/env ts-node
/**
 * Script to scrape content from Hugging Face documentation
 * Usage: npm run scrape:huggingface
 */

import { scrapeUrls } from '../lib/scraper/core';
import { HuggingFaceSource } from '../lib/scraper/sources';
import { saveScrapedContent, saveLearningContent, initDataDirectories } from '../lib/scraper/storage';
import { toLearningSections } from '../lib/scraper/transform';

async function scrapeHuggingFace() {
  console.log('🚀 Starting Hugging Face scraper...');
  
  // Initialize data directories
  initDataDirectories();
  
  // Prepare configurations
  const configs = HuggingFaceSource.configs.map((config) => ({
    url: config.url,
    selector: config.selector,
    metadata: {
      difficulty: config.metadata?.difficulty || 'intermediate',
      topics: config.metadata?.topics || ['prompt engineering', 'hugging face'],
    },
  }));
  
  console.log(`Found ${configs.length} URLs to scrape from Hugging Face`);
  
  // Scrape the URLs
  const results = await scrapeUrls(configs);
  
  console.log(`Successfully scraped ${results.length} pages from Hugging Face`);
  
  // Save scraped content and convert to learning sections
  for (const result of results) {
    console.log(`Processing: ${result.title}`);
    
    // Save the raw scraped content
    await saveScrapedContent(result);
    
    // Transform to learning sections
    const learningContent = toLearningSections(result);
    
    // Save the learning content
    await saveLearningContent(learningContent);
    
    console.log(`✅ Saved learning content: ${learningContent.title} (ID: ${learningContent.id})`);
  }
  
  console.log('✨ Hugging Face scraper completed successfully!');
}

// Run the scraper
scrapeHuggingFace().catch((error) => {
  console.error('Error running Hugging Face scraper:', error);
  process.exit(1);
}); 