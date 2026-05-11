import { component$, Slot } from "@foundry/website/server";
import { SiteFooter, SiteToolbar } from "@foundry/components";

export default component$(() => (
    <>
        <SiteToolbar />
        <Slot name="header" />
        <main class="relative z-80 h-full grow mt-24 px-6 flex-col flex-wrap space-y-4">
            <Slot />
        </main>
        <Slot name="footer" />
        <SiteFooter />
    </>
));
