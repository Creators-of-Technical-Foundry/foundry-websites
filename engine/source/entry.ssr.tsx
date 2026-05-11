/**
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 */
import { renderToStream, type RenderToStreamOptions } from "@qwik.dev/core/server";
import { manifest } from "@qwik-client-manifest";
import DocumentRoot from "./root.tsx";

// noinspection JSUnusedGlobalSymbols - Used by Qwik Vite Plugin
export default function (opts: RenderToStreamOptions) {
    return renderToStream(<DocumentRoot />, {
        manifest,
        ...opts,
        containerTagName: "html",
    });
}
