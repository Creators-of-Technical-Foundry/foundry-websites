/**
 * Development entry point using only client-side modules:
 * - Do not use this mode in production!
 * - No SSR
 * - No portion of the application is pre-rendered on the server.
 * - All the applications are running eagerly in the browser.
 * - More code is transferred to the browser than in SSR mode.
 * - Optimizer/Serialization/Deserialization code is not exercised!
 */
import { render, type RenderOptions } from "@builder.io/qwik";
import DocumentRoot from "./root.tsx";

// noinspection JSUnusedGlobalSymbols - Used by Qwik Vite Plugin
export default function (opts: RenderOptions) {
    return render(document, <DocumentRoot />, opts);
}
