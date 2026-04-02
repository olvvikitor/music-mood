const LOCAL_NETWORK_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|[a-zA-Z0-9-]+|[a-zA-Z0-9-]+\.local)$/;

const REMOTE_FALLBACK_API_URL = "https://motionfy.onrender.com";

function isLoopbackHost(hostname: string) {
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
}

export function getApiBaseUrl() {
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (typeof window !== "undefined") {
        const { protocol, hostname } = window.location;

        if (configuredApiUrl) {
            try {
                const configuredHost = new URL(configuredApiUrl).hostname;
                if (!(isLoopbackHost(configuredHost) && !isLoopbackHost(hostname))) {
                    return configuredApiUrl;
                }
            } catch {
                return configuredApiUrl;
            }
        }

        if (LOCAL_NETWORK_HOST_PATTERN.test(hostname)) {
            return `${protocol}//${hostname}:3000`;
        }

        return REMOTE_FALLBACK_API_URL;
    }

    return configuredApiUrl || REMOTE_FALLBACK_API_URL;
}