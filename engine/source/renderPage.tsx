import type { ResolvedPage } from "./types.ts";
import type { Context } from "hono";

import { component$ } from "@builder.io/qwik";

// import {isDev} from "@builder.io/qwik/build";
import { type QwikManifest, symbolMapper } from "@builder.io/qwik/optimizer";
import { renderToString } from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
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
                {
                    manifest: manifest ?? {} as QwikManifest,
                    symbolMapper,
                },
            )).html,
        );
    };
}
