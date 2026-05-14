export default ({ title, children }: Lume.Data, _: Lume.Helpers) => (
    <>
        {{ __html: "<!DOCTYPE html>" }}
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body data-theme="dark">
                {children}
            </body>
        </html>
    </>
);
