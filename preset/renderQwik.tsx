import type Site from "@lume/core/site.ts";
import type { Engine, Helper } from "@lume/core/renderer.ts";
import { merge } from "@lume/core/utils/object.ts";
import loader from "@lume/core/loaders/module.ts";

import type { JSX, JSXOutput } from "@qwik.dev/core";
import { renderToString } from "@qwik.dev/core/server";
import { inlinedQrl } from "@qwik.dev/core";

import type { InputOption } from "rolldown";
import { rolldown } from "rolldown";
import type { QwikManifest } from "@qwik.dev/bundler/types.ts";
import { qwikClient, qwikServer } from "@qwik.dev/bundler/rolldown.ts";
import denoPlugin from "@deno/rolldown-plugin";

export type Options = {
    /** File extensions to load */
    extensions?: string[];

    /** Optional sub-extension for page files */
    pageSubExtension?: string;

    /**
     * Custom includes path
     * @default `site.options.includes`
     */
    includes?: string;
};

export type RenderData = Record<string, unknown> & {
    content: JSXOutput | undefined;
    children: JSXOutput | undefined;
    basename: string;
    tags: string[];
    title?: string;
    url: string;
    date: Date;
    page: Lume.Page;
};

export const DefaultOptions: Options = {
    extensions: [".jsx", ".tsx"],
    pageSubExtension: ".page",
};

/**
 * Qwik Compiler to generate the necessary Client-side snippets and the manifest for SSR
 */
export class QwikCompiler {
    manifest: QwikManifest | undefined;
    sourceDir: string;

    constructor(
        public rootPath: string,
        public sourcePath: string,
        public buildPath = "./dist",
    ) {
        this.sourceDir = this.sourcePath.replace(this.rootPath, ".");
        console.log("sourceDir:", this.sourceDir);
    }

    mapInput(sourceFile: string): object {
        const key = sourceFile
            .replaceAll(/[^\w-]/g, "~")
            .replace(/~tsx?$/g, "")
            .split("source~").at(1);

        return Object.fromEntries([[`q-${key}`, sourceFile]]);
    }

    async rolldown({ side, inputs, output }: {
        side: "server" | "client";
        inputs: InputOption;
        output: string;
    }) {
        const bundle = await rolldown({
            input: inputs,
            plugins: [
                side === "client"
                    ? qwikClient({
                        rootDir: this.sourcePath,
                        onManifest: (manifest) => {
                            globalThis.__QWIK_MANIFEST__ = manifest;
                            this.manifest = manifest;
                        },
                    })
                    : null,
                side === "server"
                    ? qwikServer({
                        rootDir: this.sourcePath,
                        manifestInput: this.manifest,
                    })
                    : null,
                denoPlugin(),
            ].filter(Boolean),
            external: [
                ...(side === "server"
                    ? [
                        /^@qwik\.dev\//,
                    ]
                    : []),
            ],
        });
        await bundle.write({
            format: "esm",
            cleanDir: true,
            dir: output,
            minify: true,
            hashCharacters: "base36",
            codeSplitting: {
                minSize: 20000,
                groups: [
                    {
                        name: "vendor",
                        test: /node_modules/,
                    },
                ],
            },
        });
        await bundle.close();
    }

    async compile(page: Lume.Page): Promise<Lume.Page> {
        const pageDest = this.mapInput(`${this.sourceDir}${page.src.path}${page.src.ext}`);
        const layoutDest = this.mapInput(`${this.sourceDir}/templates/${page.data.layout}`);
        page.data = {
            ...page.data,
            qwikLayout: `${this.rootPath}/server/${Object.keys(layoutDest).at(0)}.js`,
            qwikSource: `${this.rootPath}/server/${Object.keys(pageDest).at(0)}.js`,
        };

        const sharedInputs = { ...layoutDest, ...pageDest };

        await this.rolldown({
            inputs: sharedInputs,
            output: this.buildPath,
            side: "client",
        });

        await this.rolldown({
            inputs: sharedInputs,
            output: this.rootPath + "/server",
            side: "server",
        });

        return page;
    }
}

/** Template engine to render JSX files */
export class QwikEngine implements Engine {
    helpers: Record<string, Helper> = {};

    constructor(
        public basePath: string,
        public buildPath: string,
        public includes: string,
        public compiler: QwikCompiler,
    ) {}

    deleteCache() {}

    async render(source: unknown, { content: _, children, page, ...data }: RenderData) {
        // If content is a string, nothing to covert anymore
        if (typeof source === "string") return source;
        const compiled = await this.compiler.compile(page);

        if (this.compiler.manifest === undefined) {
            throw new Error("Qwik Client manifest failed to be generated!");
        }

        const props = Object.entries(data);
        const safeProps = Object.fromEntries(
            props.filter((prop) => typeof prop[1] !== "function")
                .filter((prop) => ! ["search"].includes(prop[0])),
        );

        const Layout = (await import(compiled.data.qwikLayout)).default;
        const Content = (await import(compiled.data.qwikSource)).default;
        const render = await renderToString(
            <Layout {...safeProps}>
                <Content {...safeProps} />
            </Layout>,
            {
                manifest: this.compiler.manifest,
                containerTagName: "html",
            },
        );

        return render.html;
    }

    addHelper(name: string, fn: Helper) {
        this.helpers[name] = fn;
    }
}

/**
 * A plugin to render JSX files to HTML
 * @see https://lume.land/plugins/jsx/
 */
export function qwik(userOptions?: Options) {
    return (site: Site) => {
        const rootPath = site.root();
        const sourcePath = site.src();
        const buildPath = site.dest();

        const { includes, extensions, pageSubExtension } = merge(
            { ...DefaultOptions, includes: site.options.includes },
            userOptions,
        );

        // Ignore includes path as they are for including in the builds
        if (includes) site.ignore(includes);

        // Parse JSX files and generate client-side JavaScript
        const compiler = new QwikCompiler(rootPath, sourcePath, buildPath);
        site.process(extensions, async (filteredPages: Lume.Page[], allPages: Lume.Page[]) => {
            if (!filteredPages.length) return;
            for (const page of filteredPages) {
                allPages.push(await compiler.compile(page));
            }
        });

        // Load the pages and parse to HTML via the Qwik JSX engine
        site.loadPages(extensions, {
            engine: new QwikEngine(sourcePath, buildPath, includes, compiler),
            pageSubExtension,
            loader,
        });
    };
}

export default qwik;

/** Extends globally available types */
declare global {
    // noinspection ES6ConvertVarToLetConst - Required to be `var` for type compatibility
    var __QWIK_MANIFEST__: QwikManifest | undefined;

    namespace Lume {
        export interface Data {
            children?: JSX.Element[] | JSX.Element;
            content?: JSXOutput;
        }
    }
}
