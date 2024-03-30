import { API_URL } from '../config';
import type { Endpoint } from './endpoints';

interface RequestOptions {
    body?: {
        [key: string]: unknown;
    };
    headers?: {
        [key: string]: string;
    };
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    params?: {
        [key: string]: string | undefined;
    };
    query?: {
        [key: string]: string | string[];
    };
    signal?: AbortSignal;
    token?: string;
}

const HEADERS_CONFIG = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export const callApi = async (
    endpoint: Endpoint,
    { body, headers, method = 'GET', params, query, signal }: RequestOptions,
) => {
    if (method === 'GET' && body) {
        throw new Error('GET requests cannot have a body');
    }

    const reqHeaders = {
        ...HEADERS_CONFIG,
        ...(headers ?? {}),
    };

    const queryEntries = query ? Object.entries(query) : [];
    const paramsEntries = params ? Object.entries(params) : [];

    // Build query string
    const queryString = queryEntries.reduce((prev, curr, i) => {
        if (!curr[1]) {
            return prev;
        }
        // Array are processed as multiple occurrences of the same key
        // e.g. [value1, value2] => ?key=value1&key=value2
        const queryChunk = Array.isArray(curr[1])
            ? curr[1].reduce((prevChunk, currChunk, iChunk) => {
                  return `${prevChunk}${iChunk !== 0 ? '&' : ''}${
                      curr[0]
                  }=${currChunk}`;
              }, '')
            : `${curr[0]}=${curr[1]}`;

        return `${prev}${i !== 0 ? '&' : ''}${queryChunk}`;
    }, '?');

    // Inject params
    const parsedPathname =
        paramsEntries.length !== 0
            ? paramsEntries.reduce(
                  (prev, curr) =>
                      curr[1] ? prev.replace(`[${curr[0]}]`, curr[1]) : prev,
                  endpoint as string,
              )
            : endpoint;

    const url = encodeURI(
        `${API_URL}${parsedPathname}${
            queryString && queryString !== '?' ? queryString : ''
        }`,
    );

    return await fetch(url, {
        body: body ? JSON.stringify(body) : undefined,
        headers: reqHeaders,
        signal,
        method,
    });
};