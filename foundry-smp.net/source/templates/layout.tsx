import { component$, Slot } from "@foundry/preset";

export default component$<Lume.Data>(function Layout({ title, domain }) {
    console.log("layout.tsx is now rendering!");

    return (
        <>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="preconnect" href={domain} />
                <link rel="preload" href="/styles.css" />
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body data-theme="dark">
            <Slot />
            </body>
        </>
    )
});
