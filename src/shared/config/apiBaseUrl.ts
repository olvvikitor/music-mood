const LOCAL_NETWORK_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/;

export function getApiBaseUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    if (typeof window !== "undefined") {
        const { protocol, hostname } = window.location;
        if (LOCAL_NETWORK_HOST_PATTERN.test(hostname)) {
            return `${protocol}//${hostname}:3000`;
        }
    }

    return "http://localhost:3000";
}