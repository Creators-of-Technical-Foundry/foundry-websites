/**
 * @jsxImportSource @qwik.dev/core
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point is the primary environment.
 */
import type { RenderOptions } from "@qwik.dev/core";
import { renderToString } from "@qwik.dev/core/server";
import { manifest } from "@qwik-client-manifest";
import DocumentRoot from "./qwik.document.tsx";

// noinspection JSUnusedGlobalSymbols - Used by Qwik Vite Plugin
export default function (opts: RenderOptions) {
    return renderToString(<DocumentRoot />, {
        manifest,
        ...opts,
        containerTagName: "html",
        containerAttributes: {
            lang: "en-gb",
        },
    });
}
