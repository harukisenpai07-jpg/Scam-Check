export async function checkSafeBrowsing(urls) {
    if (!urls || urls.length === 0) return [];
    const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (!apiKey) {
        console.warn("Google Safe Browsing API key not found");
        return [];
    }

    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

    const payload = {
        client: {
            clientId: "scam-checker-pwa",
            clientVersion: "1.0.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: urls.map(url => ({ url }))
        }
    };

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        return data.matches || [];
    } catch (err) {
        console.error("Safe Browsing API failed:", err);
        return [];
    }
}
