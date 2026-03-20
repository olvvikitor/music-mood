import { NextRequest } from "next/server";

const HOP_BY_HOP_HEADERS = new Set([
    "connection",
    "content-length",
    "host",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
]);

function buildBackendUrl(request: NextRequest, path: string[]) {
    const protocol = request.nextUrl.protocol === "https:" ? "https" : "http";
    const search = request.nextUrl.search;
    return `${protocol}://${request.nextUrl.hostname}:3000/${path.join("/")}${search}`;
}

async function proxyRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params;
    const targetUrl = buildBackendUrl(request, path);
    const headers = new Headers(request.headers);

    for (const header of HOP_BY_HOP_HEADERS) {
        headers.delete(header);
    }

    const body = request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body,
        redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);
    for (const header of HOP_BY_HOP_HEADERS) {
        responseHeaders.delete(header);
    }

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
    });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, context);
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(request, context);
}