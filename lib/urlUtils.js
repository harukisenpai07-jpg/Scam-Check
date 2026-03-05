export function extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

export async function unshortenUrl(url) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        // We try to fetch the URL to see if it redirects. We only follow manual redirects to capture the first hop if it's a shortener.
        const res = await fetch(url, { redirect: "manual", signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.status >= 300 && res.status < 400 && res.headers.has("location")) {
            // It's a redirect, return the true destination
            // Handle relative redirects just in case (e.g. /login)
            const location = res.headers.get("location");
            if (location.startsWith('http')) return location;
            const urlObj = new URL(url);
            return `${urlObj.origin}${location.startsWith('/') ? '' : '/'}${location}`;
        }
        return url;
    } catch (err) {
        console.warn(`Failed to unshorten URL ${url}:`, err);
        return url;
    }
}
