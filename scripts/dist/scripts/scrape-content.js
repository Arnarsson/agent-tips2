"use strict";
// scripts/scrape-content.ts
// Script to scrape content from various sources and generate learning content
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("../lib/scraper");
async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const sourceName = args[0];
    const limit = parseInt(args[1]) || Infinity;
    console.log('Prompt Engineering Academy - Content Scraper');
    console.log('=============================================');
    // Get configurations based on source name or all sources
    const configs = sourceName
        ? (0, scraper_1.getSourceConfigs)(sourceName)
        : (0, scraper_1.getAllConfigs)();
    if (configs.length === 0) {
        console.error(`No configurations found${sourceName ? ` for source "${sourceName}"` : ''}.`);
        process.exit(1);
    }
    // Limit the number of URLs to scrape
    const limitedConfigs = limit < Infinity ? configs.slice(0, limit) : configs;
    console.log(`Scraping ${limitedConfigs.length} URLs...`);
    // Scrape the URLs
    const scrapedContents = await (0, scraper_1.scrapeUrls)(limitedConfigs);
    console.log(`Successfully scraped ${scrapedContents.length} of ${limitedConfigs.length} URLs.`);
    // Save the scraped content
    for (const content of scrapedContents) {
        const filePath = (0, scraper_1.saveScrapedContent)(content);
        console.log(`Saved scraped content to ${filePath}`);
    }
    // Transform the scraped content to learning content
    const learningContents = scrapedContents.map(content => (0, scraper_1.toLearningSections)(content));
    console.log(`Transformed ${learningContents.length} scraped content items to learning content.`);
    // Save the learning content
    for (const content of learningContents) {
        const filePath = (0, scraper_1.saveLearningContent)(content);
        console.log(`Saved learning content to ${filePath}`);
        // Log examples and exercises
        const examplesCount = content.examples?.length || 0;
        const exercisesCount = content.exercises?.length || 0;
        console.log(`  -> Generated ${examplesCount} examples and ${exercisesCount} exercises.`);
    }
    // Generate the learning content index
    const indexPath = (0, scraper_1.generateLearningContentIndex)();
    console.log(`Generated learning content index at ${indexPath}`);
    console.log('\nScraping completed successfully!');
}
// Run the main function
main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
