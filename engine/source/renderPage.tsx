import type { HonoComponent, PageComponent } from "./types.ts";
import { QWIK_LOADER } from '@qwik.dev/core/loader';
import type { Context } from "@hono/hono";
import stylesPath from "./styles.css?url";

// noinspection HtmlRequiredTitleElement - Expected to be hoisted fomr childrens
export const DefaultLayout: HonoComponent = ({ children }) => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href={stylesPath} />

        </head>
        <body data-theme="dark">
            {children}
        </body>
    </html>
);

// noinspection JSUnusedGlobalSymbols - Used by the Domains
export function renderPage(pending: Promise<PageComponent>) {
    return async (context: Context) => {
        const params = context.req.param();
        const { default: Content } = (await pending) as PageComponent<typeof params>;
        const Layout = (context.getLayout() ?? DefaultLayout) as HonoComponent;

        return (await context.html(
            <Layout>
                <Content {...params} url={context.req.url} />
            </Layout>
        ));
    };
}
