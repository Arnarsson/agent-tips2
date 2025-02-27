"use strict";
// lib/scraper/transform.ts
// Utilities for transforming scraped content into learning content
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLearningSections = toLearningSections;
exports.extractExamples = extractExamples;
exports.generateExercises = generateExercises;
exports.transformHuggingFaceContent = transformHuggingFaceContent;
const cheerio = __importStar(require("cheerio"));
/**
 * Generate a random ID
 * @returns A random ID string
 */
function generateId(length = 10) {
    const chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
/**
 * Convert a scraped content to learning content
 * @param content The scraped content
 * @returns The learning content
 */
function toLearningSections(content) {
    // Generate a unique ID for the content
    const id = generateId();
    // Generate a slug from the title
    const slug = content.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
    // Create examples and exercises
    const examples = extractExamples(content);
    const exercises = generateExercises(content);
    return {
        ...content,
        id,
        slug,
        examples,
        exercises,
    };
}
/**
 * Extract examples from scraped content
 * @param content The scraped content
 * @returns An array of learning examples
 */
function extractExamples(content) {
    const examples = [];
    // Process each content section
    content.content.forEach(section => {
        // Look for sections that might contain examples
        const isExampleSection = section.heading.toLowerCase().includes('example') ||
            section.heading.toLowerCase().includes('sample') ||
            section.heading.toLowerCase().includes('case study');
        if (isExampleSection) {
            // Try to find before/after pattern in paragraphs
            let beforeText = '';
            let afterText = '';
            let description = '';
            let explanation = '';
            // Extract description from the first paragraph
            if (section.paragraphs.length > 0) {
                description = section.paragraphs[0];
            }
            // Look for code blocks that might contain before/after examples
            if (section.codeBlocks && section.codeBlocks.length >= 2) {
                beforeText = section.codeBlocks[0].code;
                afterText = section.codeBlocks[1].code;
                // Try to find explanation in paragraphs
                if (section.paragraphs.length > 1) {
                    explanation = section.paragraphs.slice(1).join('\n\n');
                }
            }
            else {
                // Try to parse from paragraphs with markers like "Before:" and "After:"
                let beforeIndex = -1;
                let afterIndex = -1;
                section.paragraphs.forEach((paragraph, index) => {
                    if (paragraph.includes('Before:') || paragraph.includes('BEFORE:')) {
                        beforeIndex = index;
                    }
                    else if (paragraph.includes('After:') || paragraph.includes('AFTER:')) {
                        afterIndex = index;
                    }
                });
                if (beforeIndex !== -1 && afterIndex !== -1) {
                    beforeText = section.paragraphs[beforeIndex].replace(/Before:|\s*BEFORE:/i, '').trim();
                    afterText = section.paragraphs[afterIndex].replace(/After:|\s*AFTER:/i, '').trim();
                    // Extract explanation
                    const explanationParagraphs = section.paragraphs.slice(afterIndex + 1);
                    if (explanationParagraphs.length > 0) {
                        explanation = explanationParagraphs.join('\n\n');
                    }
                }
            }
            // Only add if we have both before and after
            if (beforeText && afterText) {
                examples.push({
                    id: generateId(),
                    title: section.heading,
                    description,
                    before: beforeText,
                    after: afterText,
                    explanation: explanation || 'No explanation provided.',
                    type: 'prompt-engineering',
                });
            }
        }
    });
    return examples;
}
/**
 * Generate exercises from scraped content
 * @param content The scraped content
 * @returns An array of learning exercises
 */
function generateExercises(content) {
    const exercises = [];
    // Process each content section to generate exercises
    content.content.forEach(section => {
        // Skip sections that are too short
        if (section.paragraphs.length < 2)
            return;
        // Generate a multiple choice question
        if (Math.random() > 0.5) {
            // Extract a sentence from a paragraph
            const paragraph = section.paragraphs[Math.floor(Math.random() * section.paragraphs.length)];
            const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 20);
            if (sentences.length > 0) {
                const sentence = sentences[Math.floor(Math.random() * sentences.length)].trim();
                const words = sentence.split(' ');
                // Create options by modifying the sentence
                const options = [
                    sentence,
                    modifySentence(sentence),
                    modifySentence(sentence),
                    modifySentence(sentence),
                ].filter(Boolean);
                // Only add if we have enough options
                if (options.length >= 3) {
                    exercises.push({
                        id: generateId(),
                        title: `Multiple Choice: ${section.heading}`,
                        description: 'Select the most appropriate option for this prompt engineering scenario.',
                        type: 'multiple-choice',
                        question: 'Which of the following is the most effective prompt?',
                        options: shuffleArray(options),
                        correctAnswer: sentence,
                    });
                }
            }
        }
        else {
            // Generate a fill-in-the-blank exercise
            const paragraph = section.paragraphs[Math.floor(Math.random() * section.paragraphs.length)];
            const words = paragraph.split(' ');
            if (words.length > 10) {
                // Find a suitable word to blank out
                const keywordIndices = words.reduce((indices, word, index) => {
                    if (word.length > 5 && /^[A-Z]/.test(word)) {
                        indices.push(index);
                    }
                    return indices;
                }, []);
                if (keywordIndices.length > 0) {
                    const blankIndex = keywordIndices[Math.floor(Math.random() * keywordIndices.length)];
                    const blankWord = words[blankIndex];
                    words[blankIndex] = '_______';
                    exercises.push({
                        id: generateId(),
                        title: `Fill in the Blank: ${section.heading}`,
                        description: 'Complete the prompt by filling in the blank with the most appropriate term.',
                        type: 'fill-in-the-blank',
                        question: words.join(' '),
                        correctAnswer: blankWord,
                        hints: ['Consider the context of the prompt', 'Think about what would make the AI response most effective'],
                    });
                }
            }
        }
    });
    // Ensure we have at least one exercise
    if (exercises.length === 0 && content.content.length > 0) {
        // Create a rewrite exercise
        const section = content.content[0];
        if (section.paragraphs.length > 0) {
            const paragraph = section.paragraphs[0];
            exercises.push({
                id: generateId(),
                title: `Rewrite Exercise: ${section.heading}`,
                description: 'Rewrite this prompt to make it more effective.',
                type: 'rewrite',
                question: paragraph,
                hints: [
                    'Consider adding more specific instructions',
                    'Think about the structure and clarity',
                    'Add context that would help the AI understand your intent',
                ],
            });
        }
    }
    return exercises;
}
/**
 * Modify a sentence for creating multiple choice options
 * @param sentence The original sentence
 * @returns A modified version of the sentence
 */
function modifySentence(sentence) {
    const words = sentence.split(' ');
    // Randomly select a modification strategy
    const strategy = Math.floor(Math.random() * 3);
    switch (strategy) {
        case 0: // Remove important words
            if (words.length > 5) {
                const removeIndex = Math.floor(Math.random() * (words.length - 2)) + 1;
                return [...words.slice(0, removeIndex), ...words.slice(removeIndex + 1)].join(' ');
            }
            break;
        case 1: // Replace words with less effective alternatives
            if (words.length > 3) {
                const replacements = {
                    'specific': 'general',
                    'detailed': 'basic',
                    'clear': 'simple',
                    'concise': 'brief',
                    'efficient': 'quick',
                    'effective': 'useful',
                    'professional': 'formal',
                    'expert': 'knowledgeable',
                };
                const wordToReplace = Object.keys(replacements).find(word => sentence.toLowerCase().includes(word.toLowerCase()));
                if (wordToReplace) {
                    return sentence.replace(new RegExp(wordToReplace, 'i'), replacements[wordToReplace]);
                }
            }
            break;
        case 2: // Add unnecessary complexity
            if (words.length > 4) {
                const insertIndex = Math.floor(Math.random() * (words.length - 1));
                const fillers = [
                    'basically',
                    'essentially',
                    'actually',
                    'fundamentally',
                    'practically',
                    'virtually',
                    'somewhat',
                    'kind of',
                ];
                const filler = fillers[Math.floor(Math.random() * fillers.length)];
                return [
                    ...words.slice(0, insertIndex),
                    filler,
                    ...words.slice(insertIndex),
                ].join(' ');
            }
            break;
    }
    // Fallback: reverse the sentence
    return words.reverse().join(' ');
}
/**
 * Shuffle an array
 * @param array The array to shuffle
 * @returns A new shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
/**
 * Custom transformer for Hugging Face documentation
 * @param html The HTML content to transform
 * @param url The URL of the page
 * @returns The transformed content as ScrapedContent
 */
function transformHuggingFaceContent(html, url) {
    const $ = cheerio.load(html);
    const title = $('.doc-title h1').text().trim() || $('h1').text().trim() || $('title').text().trim();
    const content = [];
    // For deduplication
    const processedHeadings = new Set();
    const allProcessedParagraphs = []; // Track all paragraphs across sections for cross-section duplication
    // Log the url and title to debug
    console.log(`Transforming Hugging Face content: ${url}, Title: ${title}`);
    // Process each section in the documentation - try different selector combinations
    $('.doc-content > h2, .doc-content > h3, main h2, main h3, article h2, article h3').each((_, header) => {
        const heading = $(header).text().trim();
        // Skip if we've already processed this heading
        if (processedHeadings.has(heading)) {
            console.log(`Skipping duplicate heading: ${heading}`);
            return;
        }
        console.log(`Found heading: ${heading}`);
        processedHeadings.add(heading);
        let $section = $(header);
        const paragraphs = [];
        const codeBlocks = [];
        const images = [];
        // Extract content until the next heading
        let $element = $section.next();
        while ($element.length && !$element.is('h2, h3')) {
            // Extract paragraphs
            if ($element.is('p')) {
                const text = $element.text().trim();
                // Check against all paragraphs across sections
                if (text && !isDuplicateParagraph(allProcessedParagraphs, text)) {
                    paragraphs.push(text);
                    allProcessedParagraphs.push(text); // Add to global list
                }
            }
            else if ($element.find('p').length > 0) {
                // Try to find paragraphs inside the element
                $element.find('p').each((_, p) => {
                    const text = $(p).text().trim();
                    if (text && !isDuplicateParagraph(allProcessedParagraphs, text)) {
                        paragraphs.push(text);
                        allProcessedParagraphs.push(text); // Add to global list
                    }
                });
            }
            // Extract code blocks
            if ($element.is('pre')) {
                const $code = $element.find('code');
                const code = $code.text().trim();
                const language = $code.attr('class')?.replace('language-', '') || 'python';
                if (code && !isDuplicateCodeBlock(codeBlocks, code)) {
                    codeBlocks.push({
                        code,
                        language,
                        caption: $element.prev().is('.caption') ? $element.prev().text().trim() : undefined,
                    });
                }
            }
            else if ($element.find('pre').length > 0) {
                // Try to find code blocks inside the element
                $element.find('pre').each((_, pre) => {
                    const $code = $(pre).find('code');
                    const code = $code.text().trim();
                    const language = $code.attr('class')?.replace('language-', '') || 'python';
                    if (code && !isDuplicateCodeBlock(codeBlocks, code)) {
                        codeBlocks.push({
                            code,
                            language,
                            caption: $(pre).prev().is('.caption') ? $(pre).prev().text().trim() : undefined,
                        });
                    }
                });
            }
            // Extract images
            if ($element.is('img') || $element.find('img').length > 0) {
                const $img = $element.is('img') ? $element : $element.find('img');
                $img.each((_, img) => {
                    const src = $(img).attr('src');
                    if (src) {
                        images.push({
                            url: src.startsWith('http') ? src : new URL(src, url).toString(),
                            alt: $(img).attr('alt') || undefined,
                            caption: $(img).closest('figure').find('figcaption').text().trim() || undefined,
                        });
                    }
                });
            }
            $element = $element.next();
        }
        // Add section if it has content
        if (paragraphs.length > 0 || codeBlocks.length > 0 || images.length > 0) {
            content.push({
                heading,
                paragraphs,
                codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
                images: images.length > 0 ? images : undefined,
            });
        }
    });
    // If no content was found, try a more general approach
    if (content.length === 0) {
        console.log("No content found with headings, trying a more general approach");
        // Extract all paragraphs from the main content
        const mainSelector = '.doc-content, main, article, .main-content';
        $(mainSelector).find('p').each((_, p) => {
            const text = $(p).text().trim();
            if (text) {
                // Only add if we have substantial content
                if (text.length > 30) {
                    content.push({
                        heading: "Main Content",
                        paragraphs: [text],
                    });
                }
            }
        });
        // Extract all code blocks
        const codeBlocks = [];
        $(mainSelector).find('pre code').each((_, code) => {
            const codeText = $(code).text().trim();
            const language = $(code).attr('class')?.replace('language-', '') || 'python';
            if (codeText) {
                codeBlocks.push({
                    code: codeText,
                    language,
                });
            }
        });
        if (codeBlocks.length > 0) {
            content.push({
                heading: "Code Examples",
                paragraphs: [], // Adding the required paragraphs property
                codeBlocks,
            });
        }
    }
    console.log(`Extracted ${content.length} content sections`);
    // Calculate estimated read time
    const totalWords = content.reduce((acc, section) => {
        return acc + section.paragraphs.join(' ').split(' ').length;
    }, 0);
    const estimatedReadTime = Math.max(1, Math.ceil(totalWords / 200)); // 200 words per minute
    // Extract topics from tags or categories
    let topics = $('.tags a, .category-tags a, .doc-tag').map((_, el) => $(el).text().trim()).get();
    // If no topics were found, extract from content
    if (!topics || topics.length === 0) {
        topics = extractTopicsFromContent(content, title, url);
    }
    return {
        title,
        url,
        sourceName: 'Hugging Face',
        sourceUrl: 'https://huggingface.co',
        content,
        metadata: {
            difficulty: determineDifficulty(content),
            topics,
            estimatedReadTime,
            dateScraped: new Date().toISOString(),
        },
    };
}
/**
 * Helper function to check if a paragraph is a duplicate or too similar to existing paragraphs
 * @param existingParagraphs Array of existing paragraphs
 * @param newParagraph New paragraph to check
 * @returns True if the paragraph is a duplicate
 */
function isDuplicateParagraph(existingParagraphs, newParagraph) {
    // Simple exact match check
    if (existingParagraphs.includes(newParagraph)) {
        return true;
    }
    // Check for similarity (if more than 70% of words are the same)
    const newWords = new Set(newParagraph.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    for (const existing of existingParagraphs) {
        const existingWords = new Set(existing.toLowerCase().split(/\s+/).filter(w => w.length > 3));
        if (newWords.size === 0 || existingWords.size === 0)
            continue;
        // Count overlapping words
        let overlap = 0;
        for (const word of newWords) {
            if (existingWords.has(word)) {
                overlap++;
            }
        }
        // Calculate similarity ratio
        const similarityRatio = overlap / Math.min(newWords.size, existingWords.size);
        // Lower the threshold from 0.8 to 0.7 to catch more duplicates
        if (similarityRatio > 0.7) {
            return true;
        }
    }
    return false;
}
/**
 * Helper function to check if a code block is a duplicate
 * @param existingBlocks Array of existing code blocks
 * @param newCode New code to check
 * @returns True if the code block is a duplicate
 */
function isDuplicateCodeBlock(existingBlocks, newCode) {
    return existingBlocks.some(block => block.code === newCode);
}
/**
 * Extract topics from content when no explicit topics are found
 * @param content Content sections
 * @param title Page title
 * @param url Page URL
 * @returns Array of extracted topics
 */
function extractTopicsFromContent(content, title, url) {
    const allText = title + ' ' +
        content.map(section => section.heading + ' ' + section.paragraphs.join(' ')).join(' ');
    const topicKeywords = {
        'prompt engineering': ['prompt', 'prompting', 'instruction'],
        'transformers': ['transformer', 'attention', 'bert', 'gpt'],
        'llm': ['llm', 'language model', 'large language model'],
        'fine-tuning': ['fine-tuning', 'fine tune', 'finetune', 'training'],
        'zero-shot': ['zero shot', 'zero-shot', 'zeroshot'],
        'few-shot': ['few shot', 'few-shot', 'fewshot'],
        'chain-of-thought': ['chain of thought', 'reasoning', 'cot'],
        'classification': ['classification', 'classifier', 'categorize'],
        'optimization': ['optimization', 'optimizing', 'optimize', 'performance'],
    };
    const extractedTopics = new Set();
    // Check for keywords in the text
    const lowerText = allText.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
        if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
            extractedTopics.add(topic);
        }
    }
    // Add additional topics based on URL patterns
    if (url.includes('tutorial'))
        extractedTopics.add('tutorials');
    if (url.includes('classif'))
        extractedTopics.add('classification');
    if (url.includes('prompt'))
        extractedTopics.add('prompting');
    if (url.includes('task'))
        extractedTopics.add('tasks');
    // Add Hugging Face as a source topic
    extractedTopics.add('hugging face');
    return Array.from(extractedTopics);
}
/**
 * Determine content difficulty based on content analysis
 * @param content The content sections to analyze
 * @returns The difficulty level
 */
function determineDifficulty(content) {
    // Count technical terms
    const allText = content.flatMap(section => section.paragraphs).join(' ');
    const technicalTerms = [
        'fine-tuning', 'hyperparameter', 'gradient', 'optimization', 'regularization',
        'inference', 'embedding', 'token', 'quantization', 'attention mechanism'
    ];
    const technicalTermCount = technicalTerms.reduce((count, term) => {
        return count + (allText.toLowerCase().match(new RegExp(term, 'g')) || []).length;
    }, 0);
    // Count code blocks
    const codeBlockCount = content.reduce((count, section) => {
        return count + (section.codeBlocks?.length || 0);
    }, 0);
    // Determine difficulty
    if (technicalTermCount > 10 || codeBlockCount > 5) {
        return 'advanced';
    }
    else if (technicalTermCount > 5 || codeBlockCount > 2) {
        return 'intermediate';
    }
    else {
        return 'beginner';
    }
}
