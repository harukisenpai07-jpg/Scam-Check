import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { extractUrls, unshortenUrl } from "@/lib/urlUtils";
import { checkSearchForScam } from "@/lib/searchApi";
import { checkSafeBrowsing } from "@/lib/safeBrowsing";
import { analyzeWithGemini } from "@/lib/llm";
import crypto from "crypto";

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!text || text.trim() === "") {
            return NextResponse.json(
                { error: "No text or link provided." },
                { status: 400 }
            );
        }

        // Hash text for caching
        const hash = crypto.createHash("sha256").update(text).digest("hex");
        const cacheKey = `analysis:${hash}`;

        // 1. Check Redis Cache
        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return NextResponse.json(cached); // @upstash/redis parses JSON automatically
            }
        }

        // 2. Extract and Unshorten URLs
        const extractedUrls = extractUrls(text);
        const urls = extractedUrls.length > 0
            ? await Promise.all(extractedUrls.map((url) => unshortenUrl(url)))
            : [];

        // 3. Parallel API Calls (Search Scams & Safe Browsing)
        // For SerpApi, just pass the first 50 chars of text safely if URLs are removed
        const textWithoutUrls = text.replace(/(https?:\/\/[^\s]+)/g, "").trim().substring(0, 50);

        const [searchResults, safeBrowsingResult] = await Promise.all([
            checkSearchForScam(textWithoutUrls || text.substring(0, 50)),
            urls.length > 0 ? checkSafeBrowsing(urls) : Promise.resolve([]),
        ]);

        // 4. Send to Gemini for Evaluation
        const result = await analyzeWithGemini(
            text,
            urls,
            safeBrowsingResult,
            searchResults
        );

        // 5. Cache Result in Redis (24 Hours)
        if (redis) {
            await redis.set(cacheKey, result, { ex: 60 * 60 * 24 });
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("API Route Error:", err.message, err.stack);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
