import { page } from "@foundry/engine";

export default page(({ title, domain, children }) => (
    <>
        {{ __html: "<!DOCTYPE html>" }}
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="preconnect" href={domain} />
                <link rel="preload" href="/styles.css" />
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body data-theme="dark">
                {children}
            </body>
        </html>
    </>
));
