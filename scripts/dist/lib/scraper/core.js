"use strict";
// lib/scraper/core.ts
// Core scraper functionality
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeUrl = scrapeUrl;
exports.scrapeUrls = scrapeUrls;
exports.extractMainContent = extractMainContent;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const types_1 = require("./types");
const transform_1 = require("./transform");
/**
 * Scrape a single URL with the given configuration
 * @param config The scraper configuration
 * @returns A promise that resolves to the scraped content
 */
async function scrapeUrl(config) {
    try {
        console.log(`Scraping URL: ${config.url}`);
        // Make the HTTP request
        const response = await axios_1.default.get(config.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        // Parse the HTML
        const html = response.data;
        // Check if URL is from Hugging Face and use the custom transformer
        if (config.url.includes('huggingface.co')) {
            console.log('Using Hugging Face transformer for URL:', config.url);
            const content = (0, transform_1.transformHuggingFaceContent)(html, config.url);
            // Validate the transformed content
            try {
                types_1.ScrapedContentSchema.parse(content);
                return content;
            }
            catch (error) {
                console.error('Validation error for Hugging Face content:', error);
                return null;
            }
        }
        // Use the custom transform function if provided
        if (config.transform) {
            const content = config.transform(html);
            // Validate the transformed content
            try {
                types_1.ScrapedContentSchema.parse(content);
                return content;
            }
            catch (error) {
                console.error('Validation error for transformed content:', error);
                return null;
            }
        }
        // Default transformation logic
        const $ = cheerio.load(html);
        const title = $('title').text().trim();
        const content = [];
        // Select content elements
        $(config.selector).each((_, element) => {
            const $element = $(element);
            const heading = $element.find('h1, h2, h3, h4, h5, h6').first().text().trim() || 'Untitled Section';
            const paragraphs = [];
            $element.find('p').each((_, p) => {
                const text = $(p).text().trim();
                if (text) {
                    paragraphs.push(text);
                }
            });
            const codeBlocks = [];
            $element.find('pre, code').each((_, code) => {
                const codeText = $(code).text().trim();
                if (codeText) {
                    codeBlocks.push({
                        code: codeText,
                        language: $(code).attr('class')?.replace('language-', '') || 'plaintext',
                    });
                }
            });
            const images = [];
            $element.find('img').each((_, img) => {
                const src = $(img).attr('src');
                if (src) {
                    images.push({
                        url: src.startsWith('http') ? src : new URL(src, config.url).toString(),
                        alt: $(img).attr('alt') || undefined,
                        caption: $(img).closest('figure').find('figcaption').text().trim() || undefined,
                    });
                }
            });
            content.push({
                heading,
                paragraphs,
                codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
                images: images.length > 0 ? images : undefined,
            });
        });
        // Default metadata
        const defaultMetadata = {
            difficulty: 'intermediate',
            topics: [],
            estimatedReadTime: Math.max(1, Math.ceil(content.reduce((acc, section) => {
                return acc + section.paragraphs.join(' ').split(' ').length;
            }, 0) / 200)), // Rough estimate: 200 words per minute, minimum 1 minute
            dateScraped: new Date().toISOString(),
        };
        // Create the scraped content
        const scrapedContent = {
            title,
            url: config.url,
            sourceName: new URL(config.url).hostname,
            sourceUrl: new URL(config.url).origin,
            content,
            metadata: {
                ...defaultMetadata,
                ...(config.metadata || {}),
            },
        };
        // Validate the scraped content
        try {
            types_1.ScrapedContentSchema.parse(scrapedContent);
            return scrapedContent;
        }
        catch (error) {
            console.error('Validation error:', error);
            return null;
        }
    }
    catch (error) {
        console.error(`Error scraping URL ${config.url}:`, error);
        return null;
    }
}
/**
 * Scrape multiple URLs with the given configurations
 * @param configs An array of scraper configurations
 * @returns A promise that resolves to an array of scraped content
 */
async function scrapeUrls(configs) {
    const results = [];
    // Scrape URLs one at a time to be respectful of rate limits
    for (const config of configs) {
        // Add a delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        const result = await scrapeUrl(config);
        if (result) {
            results.push(result);
        }
    }
    return results;
}
/**
 * Extract the main content from a webpage
 * @param url The URL to scrape
 * @returns A promise that resolves to the main content HTML
 */
async function extractMainContent(url) {
    try {
        // Make the HTTP request
        const response = await axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        // Parse the HTML
        const html = response.data;
        const $ = cheerio.load(html);
        // Remove unwanted elements
        $('nav, header, footer, aside, script, style, iframe, .sidebar, .menu, .ad, .advertisement, .cookie, .popup').remove();
        // Try to find the main content using common selectors
        const selectors = [
            'main',
            'article',
            '.main-content',
            '.content',
            '.article',
            '.post',
            '#content',
            '#main',
        ];
        for (const selector of selectors) {
            const content = $(selector);
            if (content.length > 0) {
                return content.html() || null;
            }
        }
        // If no main content found, return the body
        return $('body').html() || null;
    }
    catch (error) {
        console.error(`Error extracting main content from ${url}:`, error);
        return null;
    }
}
