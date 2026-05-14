import lume from "@lume/core";
import tailwindcss from "@lume/tailwindcss";
// import mdx from "lume/plugins/mdx.ts";
import jsx from "@lume/jsx";

export type SiteConfig = {
    domain?: string;
    serverData?: Record<string, unknown>;
};

// TODO: Figure out a better solution than using node compatibility
import * as fs from 'node:fs/promises';
const themeFiles = await Array.fromAsync(fs.glob("../theme/**/*.tsx"));

// noinspection JSUnusedGlobalSymbols - Used by the website domains
export function defineWebsite(config: SiteConfig) {
    const site = lume({
        dest: "./build",
        includes: "./templates",
        src: "./source",
        server: {
            hostname: '0.0.0.0',
            port: 8080,
        },
        watcher: {
            include: themeFiles,
        }
    });

    site.data("layout", "layout.tsx");
    site.data("domain", `https://${config.domain ?? 'localhost'}`);
    site.add('assets');

    for (const [key, value] of Object.entries(config.serverData ?? {})) {
        site.data(key, value);
    }

    site.use(tailwindcss({ minify: true })).add("styles.css");
    site.use(jsx());

    return site;
}
