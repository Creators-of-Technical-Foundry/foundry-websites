/**
 * @jsxImportSource @qwik.dev/core
 *
 * Global container for the Qwik compiler application
 */
import { component$, Slot } from "@qwik.dev/core";
import stylesPath from "./styles.css?url";

// noinspection JSUnusedGlobalSymbols - Used by Qwik during build
export default component$(() => (
    <>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href={stylesPath} />
            <title>Qwik Compiler</title>
        </head>
        <body data-theme="dark">
            <Slot />
        </body>
    </>
));
