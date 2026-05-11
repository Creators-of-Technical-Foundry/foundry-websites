import type { ResolvedPage } from "./types.ts";
import type { Context } from "hono";

import { component$ } from "@qwik.dev/core";

// import {isDev} from "@qwik.dev/core/build";
import { renderToString } from "@qwik.dev/core/server";
import DocumentRoot from "./root.tsx";

// noinspection JSUnusedGlobalSymbols - Used by the Domains
export function renderPage(
    PendingPage: Promise<ResolvedPage>,
): (context: Context) => Promise<Response> {
    return async (context: Context) => {
        const Page = await PendingPage;
        const PageHead = Page.Head ?? component$(() => <title>Test</title>);

        return context.html(
            (await renderToString(
                <DocumentRoot Head={PageHead}>
                    <Page.Body />
                </DocumentRoot>,
            )).html,
        );
    };
}
