export async function checkSearchForScam(keywords) {
    if (!keywords) return null;
    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
        console.warn("SerpAPI key not found");
        return null;
    }

    try {
        const query = encodeURIComponent(`"${keywords}" scam OR fraud OR phishing text`);
        const url = `https://serpapi.com/search.json?q=${query}&hl=en&gl=us&api_key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        // Extract top 3 organic results snippets
        const results = data.organic_results?.slice(0, 3).map(r => ({
            title: r.title,
            snippet: r.snippet
        })) || [];

        return results;
    } catch (err) {
        console.error("SerpAPI search failed:", err);
        return null;
    }
}
