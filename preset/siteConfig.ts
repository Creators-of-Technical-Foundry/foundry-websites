import lume from "@lume/core";
import tailwindcss from "@lume/tailwindcss";
import picture from "@lume/picture";
import transformImages from "@lume/transform-images";
import qwik from "./renderQwik.ts";

export type SiteConfig = {
    domain?: string;
    serverData?: Record<string, unknown>;
};

// TODO: Figure out a better solution than using node compatibility
// import * as fs from "node:fs/promises";
// const themeFiles = await Array.fromAsync(fs.glob("../theme/**/*.tsx"));

// noinspection JSUnusedGlobalSymbols - Used by the website domains
export function defineWebsite(config: SiteConfig) {
    const site = lume({
        dest: "./dist",
        includes: "./templates",
        src: "./source",
        server: {
            hostname: "0.0.0.0",
            port: 8080,
        },
        // watcher: {
        //     include: themeFiles,
        // },
    });

    // Global Settings
    site.data("layout", "layout.tsx");
    site.data("domain", `https://${config.domain ?? "localhost"}`);
    for (const [key, value] of Object.entries(config.serverData ?? {})) {
        site.data(key, value);
    }

    // Handle Assets
    site.use(picture())
        .use(transformImages())
        .add("assets");

    // Rendering
    site.use(tailwindcss({ minify: true })).add("styles.css");
    site.use(qwik());

    return site;
}
