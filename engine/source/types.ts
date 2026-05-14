import type { Component as QwikComponent } from "@qwik.dev/core";
import type { FC as HonoComponent } from "@hono/hono/jsx";

export type {
    QwikComponent,
    HonoComponent,
}

/**
 * Represents a record of a web page with associated metadata.
 *
 * This type is useful for storing essential details about a page, including
 * its unique identifier, content hash for validation, and its URL.
 */
export type PageRecord<PARAMS = Record<string, never>> = {
    id: string;
    eTag: string;
    params: PARAMS;
    url: string;
};

/**
 * Represents what a `*.page.tsx` returns for rendering.
 *
 * @template PARAMS - Parameters for the page components; defaults to an empty record.
 */
export type PageComponent<PARAMS = Record<string, never>> = {
    default: HonoComponent<PARAMS & { url: string }>
}

/**
 * Represents what the `*.data.tsx` returns for SSG rendering.
 *
 * @template PARAMS - Parameters for the page components; defaults to an empty record.
 */
export type PageData<PARAMS = Record<string, never>> = {
    default: (known: Array<PageRecord<PARAMS>>) => Promise<Array<PageRecord<PARAMS>>>;
}