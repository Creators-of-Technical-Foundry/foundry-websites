import lume from "@lume/core";
import tailwindcss from "@lume/tailwindcss";
// import mdx from "lume/plugins/mdx.ts";
import jsx from "@lume/jsx";

export type SiteConfig = {
    domain?: string;
};

// noinspection JSUnusedGlobalSymbols - Used by the website domains
export function defineWebsite(_: SiteConfig) {
    const site = lume({
        dest: "./build",
        includes: "./templates",
        src: "./source",
        server: {
            hostname: '0.0.0.0',
            port: 8080,
        }
    });

    site.use(tailwindcss()).add("styles.css");
    site.use(jsx());

    return site;
}
