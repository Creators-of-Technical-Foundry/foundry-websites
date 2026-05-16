import loader from "@lume/core/loaders/module.ts";
import { merge } from "@lume/core/utils/object.ts";

import { encodeBase32 } from "@std/encoding/base32";
import { dirname } from "@std/path";

import type Site from "@lume/core/site.ts";
import type { Engine, Helper } from "@lume/core/renderer.ts";

import type { SegmentAnalysis, TransformModule, TransformOutput } from "@qwik.dev/optimizer";
import { createOptimizer } from "@qwik.dev/optimizer";

import type { JSX, JSXOutput } from "@qwik.dev/core";
import { jsx } from "@qwik.dev/core";
import { Q_BUILD_DIR, Q_BUNDLE_GRAPH } from "@qwik.dev/bundler/build/chunking.ts";

import type { QwikManifest } from "./buildManifest.ts";
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

        // if (!this.compiled.has('qwik:handlers')) {
        //     built.set('qwik:handlers', {
        //         type: "chunk",
        //         id: "handlers",
        //         fileName: "build/q-handlers.js",
        //         code: `export { _chk, _rsc, _res, _run, _task, _val, _eaC, _eaT, _suC, _suT } from "@qwik.dev/core/handlers.mjs";`,
        //         moduleIds: [],
        //         dynamicImports: [],
        //         imports: [],
        //         exports: [],
        //     })
        //     this.compiled.set('qwik:handlers', result);
        // }
        //
        if (!this.compiled.has("qwik:preloader")) {
            built.set("qwik:preloader", {
                type: "chunk",
                id: "handlers",
                fileName: "build/q-preloader.js",
                code: `export { g, l, p } from "@qwik.dev/core/preloader";`,
                moduleIds: [],
                dynamicImports: [],
                imports: [],
                exports: [],
            });
            this.compiled.set("qwik:preloader", result);
        }

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
        globalThis.__QWIK_MANIFEST__ = this.mergedManifest;
        // (globalThis as any).__QWIK_MANIFEST__ = JSON.parse(
        //     JSON.stringify(this.mergedManifest)
        //         .replaceAll(/"\/?build\//g, `"${this.buildPath}/build/`),
        // );

        for (
            const [fileName, source] of [
                [Q_BUNDLE_GRAPH, JSON.stringify(this.mergedManifest?.bundleGraph)],
                [Q_MANIFEST_FILE, JSON.stringify(this.mergedManifest, null, "\t")],
            ] as const
        ) {
            built.set(fileName, {
                type: "chunk",
                id: fileName,
                fileName,
                code: source,
                moduleIds: [],
                imports: [],
                dynamicImports: [],
                exports: [],
            });
        }

        for (const chunk of built.values()) {
            const buildFile = `${this.buildPath}/${chunk.fileName}`;
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

        const manifest = this.compiler.mergedManifest;
        const renderOpts = {
            containerTagName: "html",
            manifest,
        };

        const jsxChildren = jsx(children, data, null, true);
        // const inlineContent = inlinedQrl(jsxChildren, 's1');
        // const renderedChildren = (await renderToString(jsxChildren, { ...renderOpts, containerTagName: 'div' }))
        const varProps = { ...data, content: jsxChildren };
        console.log("QwikEngine.render()", {
            global: globalThis.__QWIK_MANIFEST__,
            manifest,
        });

        const render = await renderToString(
            jsx(source, varProps, null, true),
            renderOpts,
        );

        const [head, body] = render.html.split("</head>");
        const appendHead = [
            // `<link rel="preload" href="/${manifest?.bundleGraphAsset}" as="fetch" crossorigin="anonymous" />`,
            // `<script type="module" async crossorigin="anonymous">
            //     let b=fetch(${JSON.stringify(`/${manifest?.bundleGraphAsset}`)});
            //     import(${JSON.stringify("/build/q-preloader.js")}).then(({l})=>l(${JSON.stringify("/build")},b));
            // </script>`,
        ];

        return [head, ...appendHead, "</head>", body].join("\n");
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
