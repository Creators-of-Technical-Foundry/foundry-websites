import { component$ } from "@builder.io/qwik";

export type SiteHeroProps = {
    title?: string;
    line?: string;
};

export const SiteHero = component$<SiteHeroProps>(({ title, line }) => (
    <header
        class="h-32 lg:h-80 px-24 grid grid-cols-1 sm:grid-cols-2 auto-rows-min"
        q:slot="header"
    >
        <hgroup class="relative z-80 flex flex-col items-start justify-center">
            <h1 class="w-full text-4xl mt-24 lg:mt-12 text-foundry-500 font-bold">
                {title ?? "Technical Foundry"}
            </h1>
            <h2 class="w-full italic mt-2 text-md">
                {line ?? "Engineering and Artistry with the CreateMod on Minecraft"}
            </h2>
        </hgroup>
        <hgroup class="grow relative z-50 flex justify-center justify-items-end items-center hidden lg:block">
            <img
                class="h-60 w-60 drop-shadow-2xl drop-shadow-foundry-300"
                src="/logo-icon.png"
                alt="The Foundry SMP"
            />
        </hgroup>
    </header>
));
