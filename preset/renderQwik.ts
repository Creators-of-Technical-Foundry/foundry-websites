import loader from "@lume/core/loaders/module.ts";
import { merge } from "@lume/core/utils/object.ts";

import { encodeBase32 } from "@std/encoding/base32";
import { dirname } from "@std/path";

import type Site from "@lume/core/site.ts";
import type { Engine, Helper } from "@lume/core/renderer.ts";

import type { SymbolMapper } from "@qwik.dev/core/optimizer";
import type { SegmentAnalysis, TransformModule, TransformOutput } from "@qwik.dev/optimizer";
import { createOptimizer } from "@qwik.dev/optimizer";

import type { JSX, JSXOutput } from "@qwik.dev/core";
import { jsx } from "@qwik.dev/core";

import type { QwikManifest } from "@qwik.dev/bundler/types.ts";
import { Q_BUILD_DIR, Q_BUNDLE_GRAPH } from "@qwik.dev/bundler/build/chunking.ts";
import { createManifest, Q_MANIFEST_FILE } from "./buildManifest.ts";

import { renderToString } from "@qwik.dev/core/server";

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

export type QwikChunk = {
    type: "chunk";
    /** The unique identifier for this chunk. */
    id: string;
    /** The file name of this chunk. */
    fileName: string;
    /** The generated code of this chunk. */
    code: string;
    /** Information about the modules included in this chunk. */
    moduleIds: string[];
    /** External modules imported statically by this chunk. */
    imports: string[];
    /** External modules imported dynamically by this chunk. */
    dynamicImports: string[];
    /** Exported variable names from this chunk. */
    exports: string[];
};

export const DefaultOptions: Options = {
    extensions: [".jsx", ".tsx"],
    pageSubExtension: ".page",
};

const DYNAMIC_IMPORT_RE = /const (\w+).*import\("([^"]+)"\)/g;

/**
 * Qwik Compiler to generate the necessary Client-side snippets and the manifest for SSR
 */
export class QwikCompiler {
    compiler: ReturnType<typeof createOptimizer>;
    compiled = new Map<string, TransformOutput>();
    segments = new Map<string, SegmentAnalysis>();
    modules = new Map<string, TransformModule>();
    manifests: QwikManifest[] = [];
    mergedManifest: QwikManifest | undefined;

    constructor(
        public rootPath: string,
        public sourcePath: string,
        public buildPath = "./dist",
    ) {
        this.compiler = createOptimizer();
    }

    async chunkId(module: TransformModule): Promise<string> {
        const buffer = await crypto.subtle
            .digest("SHA-1", new TextEncoder().encode(module.path));
        return encodeBase32(new Uint8Array(buffer))
            .replaceAll("=", "") // strip base32 padding
            .toLowerCase() // filename-friendly
            .slice(0, 11);
    }

    async chunk(module: TransformModule): Promise<QwikChunk> {
        // const chunkId = await this.chunkId(module);
        const chunkId = module.segment?.hash ?? await this.chunkId(module);
        const targetPath = `${Q_BUILD_DIR}/q-${chunkId}.js`;
        const dynamicMatches = module.code.matchAll(DYNAMIC_IMPORT_RE);
        const dynamicImports = [...dynamicMatches].map((match) => match[1]);

        return {
            type: "chunk",
            id: chunkId,
            fileName: targetPath,
            code: module.code,
            moduleIds: [],
            dynamicImports,
            imports: [],
            exports: [module.segment?.name].filter(Boolean) as string[],
        };
    }

    async compile(page: Lume.Page): Promise<Lume.Page> {
        const compiler = await this.compiler;
        const built = new Map<string, QwikChunk>();

        const input = [];
        const pageSourceFile = page.src.entry?.src ?? `${this.sourcePath}/${page.src.path}${page.src.ext}`;
        if (!this.compiled.has(pageSourceFile)) {
            input.push({
                path: Deno.realPathSync(pageSourceFile),
                code: Deno.readTextFileSync(pageSourceFile),
            });
        }

        // TODO: Retrieve the site "includes" path for the layout root.
        const layoutSourceFile = `${this.sourcePath}/templates/${page.data.layout}`;
        if (!this.compiled.has(layoutSourceFile)) {
            input.push({
                path: Deno.realPathSync(layoutSourceFile),
                code: Deno.readTextFileSync(layoutSourceFile),
            });
        }

        const result = await compiler.transformModules({
            srcDir: this.sourcePath,
            rootDir: this.rootPath,
            input,
            // entryStrategy: { type: 'hoist' },
            minify: "simplify",
            transpileJsx: true,
            transpileTs: true,
            explicitExtensions: true,
            preserveFilenames: true,
            isServer: false,
            mode: "prod",
        });

        this.compiled.set(pageSourceFile, result);
        this.compiled.set(layoutSourceFile, result);

        // console.log("compile(page)", {
        //     page,
        //     result,
        // });

        for (const module of result.modules) {
            if (!module.segment) continue; // primary tossed, segments kept
            this.segments.set(module.segment.name, module.segment);
            this.modules.set(module.path, module);
            built.set(module.path, await this.chunk(module));
        }

        this.manifests.push(createManifest(built, this.segments, {
            bundleGraphAsset: Q_BUNDLE_GRAPH,
            // bundleGraphAdders: options.bundleGraphAdders,
            canonPath: (fileName: string) =>
                fileName.startsWith(this.buildPath) ? fileName.slice(this.buildPath.length) : fileName,
        }));

        const primary = result.modules.find((module) => !module.isEntry && !module.segment);
        const fallback = result.modules[0];
        if (primary !== undefined) {
            built.set(primary.path, await this.chunk(primary));
            page.content = primary.code;
        } else if (fallback !== undefined) {
            built.set(fallback.path, await this.chunk(fallback));
            page.content = fallback.code;
        }

        this.mergedManifest = this.manifests.reduce((merged, x) => merge(merged, x), {}) as QwikManifest;
        (globalThis as any).__QWIK_MANIFEST__ = JSON.parse(
            JSON.stringify(this.mergedManifest)
            .replaceAll(/"\/?build\//, `"${this.buildPath}/build/`),
        );
        console.log("Manifest Resolved", {
            manifests: this.manifests.length,
            mergedManifest: this.mergedManifest,
            GLOBAL: (globalThis as any).__QWIK_MANIFEST__,
        });

        for (
            const [fileName, source] of [
                [Q_BUNDLE_GRAPH, JSON.stringify(this.mergedManifest?.bundleGraph)],
                [Q_MANIFEST_FILE, JSON.stringify(this.mergedManifest, null, "\t")],
            ] as const
        ) {
            built.set(`/${fileName}`, {
                type: "chunk",
                id: fileName,
                fileName: `/${fileName}`,
                code: source,
                moduleIds: [],
                imports: [],
                dynamicImports: [],
                exports: [],
            });
        }

        for (const chunk of built.values()) {
            const buildFile = `${this.buildPath}${chunk.fileName}`;
            console.log("Writing file", buildFile);
            await Deno.mkdir(dirname(buildFile), { recursive: true });
            await Deno.writeTextFile(buildFile, chunk.code);
        }

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

    async render(source: unknown, { content, children, ...data }: RenderData) {
        // If content is a string, nothing to covert anymore
        if (typeof source === "string") return source;

        await this.compiler.compile(data.page);

        // When no children exist, then it is a leaf node that does not need to be rendered
        if (children == undefined) return source;

        await this.compiler.compile(data.page);

        // console.log("QwikEngine.render()", {
        //     cwd: Deno.cwd(),
        //     content,
        //     source,
        //     manifest,
        // });

        const render = await renderToString(
            jsx(source, data, children),
            {
                containerTagName: "html",
                symbolMapper: (
                    symbolName: string,
                    mapper: SymbolMapper | undefined,
                    parent?: string,
                ): [symbol: string, chunk: string] | undefined => {
                    console.log("symbolMapper(symbolName, mapper, parent)", {
                        symbolName,
                        mapper,
                        parent,
                    });

                    return undefined;
                },
            },
        );

        console.log("QwikEngine.render()", {
            cwd: Deno.cwd(),
            source,
            html: render.html,
        });

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

/** Extends Data interface */
// declare global {
//     namespace Lume {
//         export interface Data {
//             /**
//              * The JSX children elements
//              * @see https://lume.land/plugins/jsx/
//              */
//             children?: JSX.Element[] | JSX.Element;
//         }
//     }
// }
