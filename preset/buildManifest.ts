import type { SegmentAnalysis } from '@qwik.dev/optimizer';
import type {
    BundleGraphAdder,
    QwikBundle,
    QwikManifest,
    QwikSymbol,
    ServerQwikManifest,
} from '@qwik.dev/bundler/types.ts';
import { convertManifestToBundleGraph } from '@qwik.dev/bundler/build/bundle-graph.ts';
import type {QwikChunk} from "./renderQwik.ts";

export const QWIK_MANIFEST = 'globalThis.__QWIK_MANIFEST__';
export const Q_MANIFEST_FILE = 'q-manifest.json';

export interface QwikManifest {
    /** Stable hash of the final manifest payload. */
    manifestHash: string;
    /** Metadata for each known QRL symbol. */
    symbols: Record<string, QwikSymbol>;
    /** Symbol name to bundle filename lookup. */
    mapping: Record<string, string>;
    /** JavaScript bundle metadata keyed by emitted filename. */
    bundles: Record<string, QwikBundle>;
    /** Non-JavaScript assets keyed by emitted filename. */
    assets?: Record<string, QwikAsset>;
    /** Compact runtime preload graph. */
    bundleGraph?: QwikBundleGraph;
    /** Emitted asset filename for the serialized bundle graph. */
    bundleGraphAsset?: string;
    /** Emitted Qwik preloader bundle filename when detected. */
    preloader?: string;
    /** Emitted Qwik core bundle filename when detected. */
    core?: string;
    /** Emitted qwikloader bundle filename, when detected. */
    qwikLoader?: string;
    /** Global HTML tags requested by runtime integrations. */
    injections?: GlobalInjections[];
    /** Manifest schema version. */
    version: string;
}

/** HTML tags that Qwik runtime integrations should inject globally. */
export type GlobalInjections = {
    /** HTML tag name to inject. */
    tag: string;
    /** HTML attributes for the injected tag. */
    attributes?: Record<string, string>;
    /** Document location for the injected tag. */
    location: 'head' | 'body';
};

/** Compact preload graph format consumed by Qwik's runtime preloader. */
export type QwikBundleGraph = Array<string | number>;

/** Non-JavaScript asset metadata emitted alongside the manifest. */
export type QwikAsset = {
    /** Original asset name when provided by the bundler. */
    name: string | undefined;
    /** Emitted asset size in bytes. */
    size: number;
};

const HANDLERS = [
    '_chk',
    '_rsc',
    '_res',
    '_run',
    '_task',
    '_val',
    // Each
    '_eaC',
    '_eaT',
    // Suspense
    '_suC',
    '_suT',
    // Reveal
    '_reR',
    '_reC',
    '_reT',
] as const;

const HANDLER_SET = new Set(HANDLERS);
const FUNCTION_INTERACTIVITY = {
    component$: 2,
    useStyles$: 2,
    useStylesScoped$: 2,
    useAsync$: 3,
    useComputed$: 3,
    useResource$: 3,
    useTask$: 3,
    useVisibleTask$: 3,
    useOn: 3,
    useOnDocument: 3,
    useOnWindow: 3,
} as const;


export function createManifest(
    bundle: Map<string, QwikChunk>,
    segments: Map<string, SegmentAnalysis>,
    options: {
        bundleGraphAsset?: string;
        bundleGraphAdders?: Set<BundleGraphAdder>;
        canonPath?: (fileName: string) => string;
    } = {},
) {
    const canonPath = options.canonPath ?? ((fileName: string) => fileName);
    const manifest: QwikManifest = {
        version: '1',
        manifestHash: '',
        mapping: {},
        symbols: {},
        bundles: {},
        assets: {},
        injections: [],
    };

    for (const item of bundle.values()) {
        const bundleFileName = canonPath(item.fileName);

        const exportedNames = item.exports.filter((name: string) => segments.has(name));
        for (const name of exportedNames) {
            if (!manifest.mapping[name] || item.exports.length !== 1) {
                manifest.mapping[name] = bundleFileName;
            }
        }

        for (const name of item.exports.filter((name: string) => HANDLER_SET.has(name))) {
            manifest.mapping[name] = bundleFileName;
            manifest.symbols[name] = handlerSymbol(name);
        }

        const qwikBundle: QwikBundle = {
            size: item.code.length,
            total: item.code.length,
        };

        const imports = mapBundleNames(bundle, item.imports, canonPath);
        if (imports.length > 0) {
            qwikBundle.imports = imports;
        }

        const dynamicImports = mapBundleNames(bundle, item.dynamicImports, canonPath);
        if (dynamicImports.length > 0) {
            qwikBundle.dynamicImports = dynamicImports;
        }

        manifest.bundles[bundleFileName] = qwikBundle;
    }

    for (const [symbolName, segment] of segments) {
        const bundleFileName = manifest.mapping[symbolName];
        if (!bundleFileName) {
            continue;
        }
        const qwikBundle = manifest.bundles[bundleFileName];
        if (!qwikBundle) {
            continue;
        }

        const symbols = (qwikBundle.symbols ??= []);
        symbols.push(symbolName);
        manifest.symbols[symbolName] = segment;
    }

    for (const qwikBundle of Object.values(manifest.bundles)) {
        const interactivity = getBundleInteractivity(qwikBundle, manifest);
        if (interactivity > 0) {
            qwikBundle.interactivity = interactivity;
        }
    }

    computeTotals(manifest.bundles);

    if (manifest.core) {
        for (const symbol of HANDLERS) {
            manifest.mapping[symbol] ??= manifest.core;
            manifest.symbols[symbol] ??= handlerSymbol(symbol);
        }
    }

    filterRuntimeImports(manifest);
    sortManifest(manifest);

    if (options.bundleGraphAsset) {
        manifest.bundleGraph = convertManifestToBundleGraph(manifest, options.bundleGraphAdders);
        manifest.bundleGraphAsset = options.bundleGraphAsset;
        manifest.assets![options.bundleGraphAsset] = {
            name: 'bundle-graph.json',
            size: JSON.stringify(manifest.bundleGraph).length,
        };
    }

    manifest.manifestHash = '';
    manifest.manifestHash = hash(JSON.stringify(manifest));

    return manifest;
}

function handlerSymbol(symbol: string): QwikSymbol {
    return { origin: '@qwik.dev/core', displayName: symbol, hash: symbol };
}

function mapBundleNames(
    bundle: Map<string, QwikChunk>,
    names: string[],
    canonPath: (fileName: string) => string,
) {
    return names.flatMap((name) => {
        const item = bundle.get(name);
        return item ? [canonPath(item.fileName)] : [];
    });
}

export function injectManifest(code: string, manifest: QwikManifest | ServerQwikManifest | null) {
    let value = QWIK_MANIFEST;
    if (manifest?.manifestHash) {
        value = JSON.stringify({
            manifestHash: manifest.manifestHash,
            mapping: manifest.mapping,
            injections: manifest.injections,
            bundleGraph: manifest.bundleGraph,
            bundleGraphAsset: manifest.bundleGraphAsset,
            core: manifest.core,
            preloader: manifest.preloader,
            qwikLoader: manifest.qwikLoader,
        });
    }

    return code.replaceAll(`!${QWIK_MANIFEST}`, 'false').replaceAll(QWIK_MANIFEST, value);
}

function filterRuntimeImports(manifest: QwikManifest) {
    const ignored = new Set(
        [manifest.core, manifest.preloader].filter((name): name is string => !!name),
    );
    if (ignored.size === 0) {
        return;
    }

    for (const bundle of Object.values(manifest.bundles)) {
        if (!bundle.imports) {
            continue;
        }

        bundle.imports = bundle.imports.filter((name) => !ignored.has(name));
        if (bundle.imports.length === 0) {
            delete bundle.imports;
        }
    }
}

function getBundleInteractivity(bundle: QwikBundle, manifest: QwikManifest) {
    let maxScore = 0;
    for (const symbolName of bundle.symbols ?? []) {
        const symbol = manifest.symbols[symbolName];
        let score = 0;
        if (symbol?.ctxKind === 'eventHandler') {
            score = 5;
        } else if (symbol?.ctxKind === 'function') {
            score = symbol.ctxName ? (FUNCTION_INTERACTIVITY[symbol.ctxName] ?? 1) : 1;
        } else if (symbol) {
            score = 1;
        }
        maxScore = Math.max(maxScore, score);
    }
    return maxScore;
}

function computeTotals(bundles: Record<string, QwikBundle>) {
    const collect = (name: string, seen: Set<string>) => {
        const bundle = bundles[name];
        if (!bundle || seen.has(name)) return;
        seen.add(name);
        for (const dep of bundle.imports ?? []) {
            collect(dep, seen);
        }
    };

    for (const name of Object.keys(bundles)) {
        const seen = new Set<string>();
        collect(name, seen);
        bundles[name]!.total = [...seen].reduce((sum, dep) => sum + (bundles[dep]?.size ?? 0), 0);
    }
}

function sortManifest(manifest: QwikManifest) {
    manifest.mapping = sortRecord(manifest.mapping);
    manifest.symbols = sortRecord(manifest.symbols);
    manifest.bundles = sortRecord(manifest.bundles);
    manifest.assets = sortRecord(manifest.assets ?? {});
    for (const bundle of Object.values(manifest.bundles)) {
        bundle.imports?.sort();
        bundle.dynamicImports?.sort();
        bundle.origins?.sort();
        bundle.symbols?.sort();
    }
}

function sortRecord<T>(record: Record<string, T>) {
    const next: Record<string, T> = {};
    for (const key of Object.keys(record).sort()) {
        const value = record[key];
        if (value !== undefined) {
            next[key] = value;
        }
    }
    return next;
}

function hash(value: string) {
    let next = 5381;
    for (let i = 0; i < value.length; i++) {
        next = (next * 33) ^ value.charCodeAt(i);
    }

    return (next >>> 0).toString(36);
}
