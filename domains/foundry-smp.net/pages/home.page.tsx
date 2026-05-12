import { component$ } from "@foundry/website/server";
import { Article, SiteFooter, SiteHero, SiteToolbar } from "@foundry/theme";
import SiteLinks from "../deno.topnav.ts";

export const Head = component$(() => (
    <>
        <title>Create: Technical Foundry</title>
    </>
));

export const Body = component$(() => {
    return (
        <>
            <SiteToolbar homeLabel="SMP" links={SiteLinks} />
            <SiteHero
                title="Technical Foundry"
                line="Engineering aesthetic factories with the Create Mod"
            />
            <main class="relative z-80 h-full grow mt-24 px-6 flex-col flex-wrap space-y-4">
                <section class="grid grid-cols-3 grid-rows-1 gap-4">
                    <Article>
                        <h3 class="font-bold text-lg">Modpack</h3>
                        <p>Use our lightweight pack and creative space for your experiments!</p>
                    </Article>
                    <Article>
                        <h3 class="font-bold text-lg">Schematics</h3>
                        <p>Find factory modules, utility components, or the best machines!</p>
                    </Article>
                    <Article>
                        <h3 class="font-bold text-lg">Wiki</h3>
                        <p>
                            Explore the various technical behaviours, tricks, and design patterns!
                        </p>
                    </Article>
                </section>
                <section class="grid grid-cols-3 gap-4">
                </section>
            </main>
            <SiteFooter />
        </>
    );
});
