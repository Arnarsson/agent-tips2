#!/usr/bin/env ts-node
"use strict";
/**
 * Script to scrape content from Hugging Face documentation
 * Usage: npm run scrape:huggingface
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../lib/scraper/core");
const sources_1 = require("../lib/scraper/sources");
const storage_1 = require("../lib/scraper/storage");
const transform_1 = require("../lib/scraper/transform");
async function scrapeHuggingFace() {
    console.log('🚀 Starting Hugging Face scraper...');
    // Initialize data directories
    (0, storage_1.initDataDirectories)();
    // Prepare configurations
    const configs = sources_1.HuggingFaceSource.configs.map((config) => ({
        url: config.url,
        selector: config.selector,
        metadata: {
            difficulty: config.metadata?.difficulty || 'intermediate',
            topics: config.metadata?.topics || ['prompt engineering', 'hugging face'],
        },
    }));
    console.log(`Found ${configs.length} URLs to scrape from Hugging Face`);
    // Scrape the URLs
    const results = await (0, core_1.scrapeUrls)(configs);
    console.log(`Successfully scraped ${results.length} pages from Hugging Face`);
    // Save scraped content and convert to learning sections
    for (const result of results) {
        console.log(`Processing: ${result.title}`);
        // Save the raw scraped content
        await (0, storage_1.saveScrapedContent)(result);
        // Transform to learning sections
        const learningContent = (0, transform_1.toLearningSections)(result);
        // Save the learning content
        await (0, storage_1.saveLearningContent)(learningContent);
        console.log(`✅ Saved learning content: ${learningContent.title} (ID: ${learningContent.id})`);
    }
    console.log('✨ Hugging Face scraper completed successfully!');
}
// Run the scraper
scrapeHuggingFace().catch((error) => {
    console.error('Error running Hugging Face scraper:', error);
    process.exit(1);
});
