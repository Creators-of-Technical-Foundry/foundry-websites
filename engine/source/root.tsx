import type { Component, Signal } from "@qwik.dev/core";
import { component$, createContextId, Slot, useContextProvider, useSignal } from "@qwik.dev/core";

export type DocumentRootProps = {
    Head?: Component;
};

export type DocumentState = {
    theme: Signal<"dark" | "light">;
};

export const DocumentContext = createContextId<DocumentState>("document");

// noinspection JSUnusedGlobalSymbols - Used by Qwik during build
export default component$<DocumentRootProps>((props) => {
    const Head = props.Head ?? (() => null);
    const documentState: DocumentState = {
        theme: useSignal("dark"),
    };

    useContextProvider(DocumentContext, documentState);

    return (
        <>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="stylesheet" href="/assets/styles.css" />
                <Head />
            </head>
            <body data-theme={documentState.theme.value ?? 'dark'}>
                <Slot />
            </body>
        </>
    );
});
