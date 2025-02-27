"use strict";
// lib/scraper/sources.ts
// Predefined sources for scraping prompt engineering content
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllSources = exports.HuggingFaceSource = exports.PromptEngineeringGuideSource = exports.WikipediaSource = exports.OpenAISource = exports.AnthropicSource = void 0;
exports.getAllConfigs = getAllConfigs;
exports.getSourceConfigs = getSourceConfigs;
/**
 * Anthropic Prompt Engineering Guide source
 */
exports.AnthropicSource = {
    name: 'Anthropic',
    baseUrl: 'https://docs.anthropic.com',
    configs: [
        {
            url: 'https://docs.anthropic.com/claude/docs/prompting-techniques',
            selector: 'article',
            metadata: {
                difficulty: 'intermediate',
                topics: ['prompt engineering', 'techniques', 'best practices'],
            },
        },
        {
            url: 'https://docs.anthropic.com/claude/docs/advanced-prompt-engineering',
            selector: 'article',
            metadata: {
                difficulty: 'advanced',
                topics: ['advanced prompting', 'system prompts', 'few-shot learning'],
            },
        },
        {
            url: 'https://docs.anthropic.com/claude/docs/structured-output',
            selector: 'article',
            metadata: {
                difficulty: 'intermediate',
                topics: ['structured output', 'JSON', 'XML', 'formatting'],
            },
        },
    ],
};
/**
 * OpenAI Best Practices source
 */
exports.OpenAISource = {
    name: 'OpenAI',
    baseUrl: 'https://platform.openai.com',
    configs: [
        {
            url: 'https://platform.openai.com/docs/guides/prompt-engineering',
            selector: 'article',
            metadata: {
                difficulty: 'beginner',
                topics: ['prompt engineering', 'best practices', 'guidelines'],
            },
        },
        {
            url: 'https://platform.openai.com/docs/guides/function-calling',
            selector: 'article',
            metadata: {
                difficulty: 'intermediate',
                topics: ['function calling', 'tool use', 'structured output'],
            },
        },
        {
            url: 'https://platform.openai.com/docs/guides/gpt-best-practices/strategy-write-clear-instructions',
            selector: 'article',
            metadata: {
                difficulty: 'beginner',
                topics: ['clear instructions', 'best practices', 'strategies'],
            },
        },
    ],
};
/**
 * Wikipedia AI Prompt Engineering source
 */
exports.WikipediaSource = {
    name: 'Wikipedia',
    baseUrl: 'https://en.wikipedia.org',
    configs: [
        {
            url: 'https://en.wikipedia.org/wiki/Prompt_engineering',
            selector: '.mw-parser-output',
            metadata: {
                difficulty: 'beginner',
                topics: ['prompt engineering', 'overview', 'history'],
            },
        },
    ],
};
/**
 * Prompt Engineering Guide by DAIR.AI source
 */
exports.PromptEngineeringGuideSource = {
    name: 'Prompt Engineering Guide',
    baseUrl: 'https://www.promptingguide.ai',
    configs: [
        {
            url: 'https://www.promptingguide.ai/introduction/basics',
            selector: '.markdown-body',
            metadata: {
                difficulty: 'beginner',
                topics: ['basics', 'introduction', 'fundamentals'],
            },
        },
        {
            url: 'https://www.promptingguide.ai/techniques/fewshot',
            selector: '.markdown-body',
            metadata: {
                difficulty: 'intermediate',
                topics: ['few-shot learning', 'techniques', 'examples'],
            },
        },
        {
            url: 'https://www.promptingguide.ai/techniques/cot',
            selector: '.markdown-body',
            metadata: {
                difficulty: 'intermediate',
                topics: ['chain of thought', 'reasoning', 'problem solving'],
            },
        },
        {
            url: 'https://www.promptingguide.ai/applications/coding',
            selector: '.markdown-body',
            metadata: {
                difficulty: 'advanced',
                topics: ['code generation', 'programming', 'applications'],
            },
        },
    ],
};
/**
 * Hugging Face Prompt Engineering Guide source
 */
exports.HuggingFaceSource = {
    name: 'Hugging Face',
    baseUrl: 'https://huggingface.co',
    configs: [
        {
            url: 'https://huggingface.co/docs/transformers/main/llm_tutorial',
            selector: '.doc-content',
            metadata: {
                difficulty: 'intermediate',
                topics: ['prompt engineering', 'transformers', 'LLMs', 'tutorials'],
            },
        },
        {
            url: 'https://huggingface.co/docs/transformers/main/tasks/prompting',
            selector: '.doc-content',
            metadata: {
                difficulty: 'intermediate',
                topics: ['prompting', 'techniques', 'best practices'],
            },
        },
        {
            url: 'https://huggingface.co/tasks/zero-shot-classification',
            selector: 'main',
            metadata: {
                difficulty: 'advanced',
                topics: ['zero-shot learning', 'few-shot learning', 'classification'],
            },
        },
        {
            url: 'https://huggingface.co/docs/transformers/main/llm_tutorial_optimization',
            selector: '.doc-content',
            metadata: {
                difficulty: 'advanced',
                topics: ['optimization', 'performance', 'fine-tuning'],
            },
        },
    ],
};
/**
 * All sources combined
 */
exports.AllSources = [
    exports.AnthropicSource,
    exports.OpenAISource,
    exports.WikipediaSource,
    exports.PromptEngineeringGuideSource,
    exports.HuggingFaceSource,
];
/**
 * Get all scraper configurations from all sources
 * @returns An array of all scraper configurations
 */
function getAllConfigs() {
    return exports.AllSources.flatMap(source => source.configs);
}
/**
 * Get scraper configurations from a specific source
 * @param sourceName The name of the source
 * @returns An array of scraper configurations for the source
 */
function getSourceConfigs(sourceName) {
    const source = exports.AllSources.find(s => s.name.toLowerCase() === sourceName.toLowerCase());
    return source ? source.configs : [];
}
