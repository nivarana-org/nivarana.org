export const getYouTubeId = (
    input: string | null | undefined,
): string | null => {
    if (!input) return null;
    const value = input.trim();
    if (!value) return null;

    if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

    try {
        const url = new URL(value);
        const host = url.hostname.replace(/^www\./, "");

        if (host === "youtu.be") {
            const id = url.pathname.slice(1).split("/")[0];
            return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }

        if (host === "youtube.com" || host === "m.youtube.com") {
            const paramId = url.searchParams.get("v");
            if (paramId && /^[a-zA-Z0-9_-]{11}$/.test(paramId)) return paramId;

            const match = url.pathname.match(
                /^\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/,
            );
            if (match) return match[1];
        }
    } catch {
        return null;
    }

    return null;
};
