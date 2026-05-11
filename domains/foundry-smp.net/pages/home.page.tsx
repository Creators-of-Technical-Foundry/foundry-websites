import { component$ } from "@foundry/website/server";
import { SiteHero } from "@foundry/components";
import SiteLayout from "./site.layout.tsx";

export const Head = component$(() => (
    <>
        <title>Foundry SMP - Home</title>
    </>
));

export const Body = component$(() => {
    return (
        <SiteLayout>
            <SiteHero />
            <h1>Welcome to Foundry SMP</h1>
            <p>
                .... ..... ......... .... .......... ......... ...... ......... ....... ....
            </p>
        </SiteLayout>
    );
});
