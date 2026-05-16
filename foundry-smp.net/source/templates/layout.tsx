import { component$, Slot } from "@qwik.dev/core";

export default component$<Lume.Data>(function Layout({ title, domain, url, content }) {
    console.log("layout.tsx is now rendering!");

    return (
        <>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="preconnect" href={domain} />
                <link rel="preload" href="/styles.css" as="style" />
                <link rel="stylesheet" href="/styles.css" />
                <link rel="canonical" href={url} />
            </head>
            <body data-theme="dark">
            {content}
            </body>
        </>
    )
});
