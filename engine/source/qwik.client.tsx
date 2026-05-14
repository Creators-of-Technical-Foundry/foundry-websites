/**
 * @jsxImportSource @qwik.dev/core
 *
 * Client entrypoint, in most cases the Server is used, but Qwik exposes the option for rendering
 * on the client-side for bypassing SSR, primarily for development and debugging purposes.
 */
import { render, type RenderOptions } from "@qwik.dev/core";
import DocumentRoot from "./qwik.document.tsx";

// noinspection JSUnusedGlobalSymbols - Used by Qwik Vite Plugin
export default function (opts: RenderOptions) {
    return render(document, <DocumentRoot />, opts);
}
