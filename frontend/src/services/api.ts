import type { AskResponse, UploadResponse } from '../types';

const BASE_URL = '/api';

export const getSessionId = (): string | null => sessionStorage.getItem('sessionId');

export const getNewSessionId = (): string => {
    const newId = crypto.randomUUID();
    sessionStorage.setItem('sessionId', newId);
    return newId;
};

export const setSessionId = (id: string) => {
    sessionStorage.setItem('sessionId', id);
};

// Helper for headers
const getHeaders = (apiKey?: string, isMultipart: boolean = false) => {
    const headers: HeadersInit = {};
    const sessionId = getSessionId();
    if (sessionId) {
        headers['x-session-id'] = sessionId;
    }
    if (apiKey) {
        headers['x-gemini-key'] = apiKey;
    }
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const validateKey = async (apiKey: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/validate-key`, {
        method: 'POST',
        headers: getHeaders(apiKey),
    });
    if (!response.ok) return false;
    return true;
};

export const uploadFile = async (apiKey: string, file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        headers: getHeaders(apiKey, true),
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
    }

    return response.json();
};

export const askQuestion = async (apiKey: string, question: string): Promise<AskResponse> => {
    const response = await fetch(`${BASE_URL}/ask`, {
        method: 'POST',
        headers: getHeaders(apiKey),
        body: JSON.stringify({ question }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to get answer');
    }

    return response.json();
};

export const clearSession = async (apiKey: string): Promise<void> => {
    // Even for clear, we might need the key if the backend requires auth for it, 
    // but usually session clear might be open. We'll pass it if we have it.
    // The prompt says "resets all frontend state ... generates a new sessionId".
    // The backend clear probably deletes the vector store for that session.
    const sessionId = getSessionId();
    if (!sessionId) return;

    try {
        await fetch(`${BASE_URL}/clear`, {
            method: 'DELETE',
            headers: getHeaders(apiKey),
        });
    } catch (e) {
        console.error("Failed to clear session on backend", e);
    }
};
