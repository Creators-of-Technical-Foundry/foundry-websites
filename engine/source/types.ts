import type { Component as QwikComponent } from "@qwik.dev/core";

/**
 * Represents a record of a web page with associated metadata.
 *
 * This type is useful for storing essential details about a page, including
 * its unique identifier, content hash for validation, and its URL.
 */
export type PageRecord = {
    id: string;
    contentHash: string;
    param: string;
    url: URL;
};

/**
 * Represents a component responsible for rendering a page.
 *
 * This type defines a function that takes an object combining specific parameters (PARAMS)
 * and a URL object. It returns the rendered page content, either as a string or a promise
 * resolving to a string.
 *
 * @template PARAMS - Defines the specific parameters required by the page component.
 *
 * @param {PARAMS & { url: URL }} params - Parameters with the current URL context.
 * @returns {Promise<string> | string} - Rendered content of the page
 */
export type PageComponent<PARAMS> = QwikComponent<PARAMS & PageRecord>;

/**
 * Represents the definition of a webpage, encapsulating its structure and associated components.
 *
 * @template PARAMS - Parameters for the page components; defaults to an empty record.
 */
export type PageDefinition<PARAMS = Record<string, never>> =
    & {
        resolveContent?: (known: Array<PageRecord>) => Promise<Array<PageRecord>>;
        Head?: PageComponent<PARAMS>;
        Layout?: PageComponent<PARAMS>;
    }
    & (
        | { Body: PageComponent<PARAMS>; default?: never }
        | { Body?: never; default: PageComponent<PARAMS> }
    );

/**
 * Represents a resolved page used in defining routing and page composition for an application.
 *
 * This type combines the properties of a PageDefinition, omitting the "Body"
 * and "default" fields, and enhances it by introducing a "Body" field that
 * specifies the main component to be rendered for the page.
 *
 * @template PARAMS - Parameters for the page components; defaults to an empty record.
 */
export type ResolvedPage<PARAMS = Record<string, never>> =
    & Omit<PageDefinition, "Body" | "default">
    & {
        Body: PageComponent<PARAMS>;
    };
