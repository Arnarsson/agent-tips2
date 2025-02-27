"use strict";
// lib/scraper/storage.ts
// Storage utility for persisting scraped content and learning materials
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDataDirectories = initDataDirectories;
exports.saveScrapedContent = saveScrapedContent;
exports.saveLearningContent = saveLearningContent;
exports.saveLearningContents = saveLearningContents;
exports.loadAllLearningContent = loadAllLearningContent;
exports.loadLearningContentById = loadLearningContentById;
exports.generateFilename = generateFilename;
exports.generateLearningContentIndex = generateLearningContentIndex;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Define paths for storing data
const DATA_DIR = path_1.default.join(process.cwd(), 'data');
const SCRAPED_CONTENT_DIR = path_1.default.join(DATA_DIR, 'scraped-content');
const LEARNING_CONTENT_DIR = path_1.default.join(DATA_DIR, 'learning-content');
/**
 * Initializes data directories for storing scraped and learning content
 */
function initDataDirectories() {
    // Create data directory if it doesn't exist
    if (!fs_1.default.existsSync(DATA_DIR)) {
        fs_1.default.mkdirSync(DATA_DIR);
        console.log(`Created data directory: ${DATA_DIR}`);
    }
    // Create scraped content directory if it doesn't exist
    if (!fs_1.default.existsSync(SCRAPED_CONTENT_DIR)) {
        fs_1.default.mkdirSync(SCRAPED_CONTENT_DIR);
        console.log(`Created scraped content directory: ${SCRAPED_CONTENT_DIR}`);
    }
    // Create learning content directory if it doesn't exist
    if (!fs_1.default.existsSync(LEARNING_CONTENT_DIR)) {
        fs_1.default.mkdirSync(LEARNING_CONTENT_DIR);
        console.log(`Created learning content directory: ${LEARNING_CONTENT_DIR}`);
    }
}
/**
 * Saves scraped content to a JSON file
 * @param content ScrapedContent object to save
 * @returns Path to the saved file
 */
function saveScrapedContent(content) {
    // Initialize directories
    initDataDirectories();
    // Generate filename based on content title
    const filename = generateFilename(content.title) + '.json';
    const filePath = path_1.default.join(SCRAPED_CONTENT_DIR, filename);
    // Write content to file
    fs_1.default.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    return filePath;
}
/**
 * Saves learning content to a JSON file
 * @param content LearningContent object to save
 * @returns Path to the saved file
 */
function saveLearningContent(content) {
    // Initialize directories
    initDataDirectories();
    // Use content ID as filename
    const filename = `${content.id}.json`;
    const filePath = path_1.default.join(LEARNING_CONTENT_DIR, filename);
    // Write content to file
    fs_1.default.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    return filePath;
}
/**
 * Saves multiple learning content items
 * @param contentItems Array of LearningContent objects to save
 * @returns Array of file paths where the content was saved
 */
function saveLearningContents(contentItems) {
    return contentItems.map(content => saveLearningContent(content));
}
/**
 * Loads all learning content from the directory
 * @returns Array of LearningContent objects
 */
function loadAllLearningContent() {
    // Initialize directories
    initDataDirectories();
    // Read all files in the learning content directory
    const files = fs_1.default.readdirSync(LEARNING_CONTENT_DIR);
    // Filter for JSON files
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    // Load content from each file
    return jsonFiles.map(file => {
        const filePath = path_1.default.join(LEARNING_CONTENT_DIR, file);
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    });
}
/**
 * Loads learning content by ID
 * @param id ID of the learning content to load
 * @returns LearningContent object or null if not found
 */
function loadLearningContentById(id) {
    // Initialize directories
    initDataDirectories();
    // Construct file path
    const filePath = path_1.default.join(LEARNING_CONTENT_DIR, `${id}.json`);
    // Check if file exists
    if (!fs_1.default.existsSync(filePath)) {
        return null;
    }
    // Read and parse file
    const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
}
/**
 * Generates a sanitized filename from a title
 * @param title Original title
 * @returns Sanitized filename
 */
function generateFilename(title) {
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
function generateLearningContentIndex() {
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
    const indexPath = path_1.default.join(DATA_DIR, 'learning-content-index.json');
    fs_1.default.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
    return indexPath;
}
