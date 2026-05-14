import { qwikVite } from "@qwik.dev/core/optimizer";
import honoDevServer from "@hono/vite-dev-server";
import honoSiteGenerator from "@hono/vite-ssg";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "vite";

export type SiteConfig = {
    domain: string;
    publicDir?: string;
};

// noinspection JSUnusedGlobalSymbols - It is used by Vite and the Domains
export function siteConfig(config: SiteConfig) {
    const engineDir = new URL(".", import.meta.url).pathname;
    const rootDir = Deno.realPathSync(`${engineDir}/../..`);
    const domainDir = Deno.realPathSync(".");
    const entry = Deno.realPathSync(`${domainDir}/deno.server.tsx`);
    const publicDir = Deno.realPathSync(
        `${domainDir}/${config.publicDir ?? "assets"}`,
    );

    return defineConfig({
        root: domainDir,
        resolve: {
            alias: [
                { find: "@foundry/engine/config", replacement: engineDir + "/config.ts" },
                { find: "@foundry/engine/server", replacement: engineDir + "/server.ts" },
                { find: "@foundry/modules", replacement: rootDir + "/modules/source/index.ts" },
                { find: "@foundry/theme", replacement: rootDir + "/theme/source/index.ts" },
            ],
        },
        plugins: [
            honoSiteGenerator({ entry }),
            honoDevServer({ entry }),
            qwikVite({
                client: { input: engineDir + '/qwik.client.tsx' },
                ssr: { input: engineDir + '/qwik.server.tsx' },
                srcDir: engineDir,
            }),
            tailwind(),
        ],
        publicDir,
        server: {
            cors: false,
            hmr: { protocol: "ws", overlay: true },
            headers: {
                "Cache-Control": "public, max-age=0",
            },
            fs: {
                allow: [engineDir, domainDir],
                strict: false,
            },
        },
    });
}
