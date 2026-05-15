import {component} from "@foundry/engine";
import {twMerge} from "@tailwindcss/merge";

export type SiteToolbarProps = JSX.IntrinsicElements["nav"] & {
    homeLabel?: string;
    links?: Array<{
        label: string;
        href: string;
    }>;
};

export const SiteToolbarLink = component<JSX.IntrinsicElements["a"]>(({children, class: classList, ...props}) => (
    <a class={twMerge(
        "h-18 px-4 flex items-center justify-center",
        "text-lg text-foundry-50 dark:text-foundry-700 uppercase tracking-wide",
        classList?.toString())} {...props}>
        {children}
    </a>
))

export const SiteToolbar = component<SiteToolbarProps>(({homeLabel, links, class: classList}) => {
    return (
        <nav class={twMerge(
            "relative top-0 left-0 right-0 z-150 w-full p-1 mb-6",
            "bg-foundry-100/70",
            classList?.toString(),
        )}>
            <div class="h-18 my-1 w-full xl:w-6xl mx-auto flex flex-row gap-3 justify-between items-center">
                <SiteToolbarLink href="/" class="flex flex-row gap-3 items-center mr-24">
                    <img class="h-14" src="/assets/logo-title.png" alt="C:TF" transform-images="avif webp jpg 156@2"  />
                </SiteToolbarLink>
                <SiteToolbarLink href="/">{homeLabel ?? "Foundry"}</SiteToolbarLink>
                {(links ?? []).map((link) => (
                    <SiteToolbarLink href={link.href}>{link.label}</SiteToolbarLink>
                ))}
            </div>
        </nav>
    );
});
