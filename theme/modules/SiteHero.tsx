import { component } from "@foundry/engine";
import { twMerge } from "@tailwindcss/merge";

export type SiteHeroProps = JSX.IntrinsicElements["header"] & {
    title?: string;
    line?: string;
};

export const SiteHero = component<SiteHeroProps>(({ title, line, class: classList }) => (
    <header class={twMerge(
        "w-full xl:w-6xl mx-auto h-32 lg:h-60 grid grid-cols-1 sm:grid-cols-2 auto-rows-min",
        "text-foundry-100 text-shadow-foundry-800 dark:text-foundry-500 dark:text-shadow-foundry-50",
        classList?.toString(),
    )}>
        <hgroup class="relative z-60 flex flex-col items-start justify-center">
            <h1 class="w-full text-4xl mt-24 lg:mt-12 font-bold">
                {title ?? "Technical Foundry"}
            </h1>
            <h2 class="w-full italic mt-2 text-md">
                {line ?? "Engineering and Artistry with the CreateMod on Minecraft"}
            </h2>
        </hgroup>
        <hgroup class="grow relative z-50 mr-12 flex justify-center justify-items-end items-center hidden lg:block">
            <img
                class="h-60 w-60 drop-shadow-2xl drop-shadow-foundry-700 dark:drop-shadow-foundry-300"
                src="/assets/logo-icon.png"
                alt="The Foundry SMP"
            />
        </hgroup>
    </header>
));
