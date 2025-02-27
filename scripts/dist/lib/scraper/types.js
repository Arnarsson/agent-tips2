"use strict";
// lib/scraper/types.ts
// Type definitions for the scraper utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrapedContentSchema = void 0;
const zod_1 = require("zod");
// Zod schema for validation
exports.ScrapedContentSchema = zod_1.z.object({
    title: zod_1.z.string(),
    url: zod_1.z.string().url(),
    sourceName: zod_1.z.string(),
    sourceUrl: zod_1.z.string().url(),
    content: zod_1.z.array(zod_1.z.object({
        heading: zod_1.z.string(),
        paragraphs: zod_1.z.array(zod_1.z.string()),
        codeBlocks: zod_1.z
            .array(zod_1.z.object({
            code: zod_1.z.string(),
            language: zod_1.z.string().optional(),
            caption: zod_1.z.string().optional(),
        }))
            .optional(),
        images: zod_1.z
            .array(zod_1.z.object({
            url: zod_1.z.string().url(),
            alt: zod_1.z.string().optional(),
            caption: zod_1.z.string().optional(),
        }))
            .optional(),
    })),
    metadata: zod_1.z.object({
        difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
        topics: zod_1.z.array(zod_1.z.string()),
        estimatedReadTime: zod_1.z.number().positive(),
        dateScraped: zod_1.z.string().datetime(),
        lastModified: zod_1.z.string().datetime().optional(),
        createdAt: zod_1.z.string().datetime().optional(),
    }),
});
