/**
 * SSG entry point made with Hono, in all cases the application is rendered
 * outside the browser, this entry point used by the build process.
 */

import { Hono, renderPage } from "@foundry/engine/server";

const app = new Hono();
app.get("/", renderPage(import("./pages/home.page.tsx")));

// noinspection JSUnusedGlobalSymbols - Used by Vite
export default app;
