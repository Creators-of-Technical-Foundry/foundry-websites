import { type JSX, fragment } from "@foundry/engine/server";

export type SiteToolbarProps = JSX.IntrinsicElements["nav"] & {
    homeLabel?: string;
    links?: Array<{
        label: string;
        href: string;
    }>;
};

export const SiteToolbar = fragment<SiteToolbarProps>((props) => {
    return (
        <nav class="w-11/12 mx-auto xl:w-6xl fixed top-0 left-1/2 -translate-x-[50%] h-18 z-150 flex flex-row gap-3 justify-between items-center">
            <a href="/" class="flex flex-row gap-3 items-center  text-foundry-50 dark:text-foundry-700 font-medium">
                <img width={32} height={32} src="/logo-favicon.png" alt="C:TF" />
                <span class="inline-block ml-2">{props.homeLabel ?? "Foundry"}</span>
            </a>
            {(props.links ?? []).map((link) => (
                <>
                    <span class="text-foundry-50 dark:text-foundry-700 font-medium">/</span>
                    <a class="text-foundry-50 dark:text-foundry-700 font-medium" href={link.href}>{link.label}</a>
                </>
            ))}
            <div class="grow"></div>
            {/*<button*/}
            {/*    type="button"*/}
            {/*    class="w-18 h-9 bg-blend-screen bg-foundry-800 dark:bg-foundry-200 transition-colors duration-200 rounded-md p-2 overflow-hidden flex justify-between relative cursor-pointer shadow-sm"*/}
            {/*>*/}
            {/*    <span*/}
            {/*        class="absolute z-100 inline-block -left-3 top-0 bottom-0 w-12 bg-foundry-950 dark:bg-foundry-700 ded rounded-md transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"*/}
            {/*        style={documentState.theme.value == "light"*/}
            {/*               ? "transform: translateX(100%);"*/}
            {/*               : "transform: translateX(0);"}/>*/}
            {/*    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="z-120">*/}
            {/*        <path class={documentState.theme.value == "light"*/}
            {/*                         ? "fill-foundry-400 transition-colors duration-200"*/}
            {/*                         : "fill-foundry-50 transition-colors duration-200"}*/}
            {/*              d="M12.3,2C12.2,2 12.1,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22C15,22 16.7,21 18.5,19.5C13,21 8,17 8,12C8,7 13,3 18.5,4.5C16.86,2.86 14.62,1.96 12.3,2M16.8,6.2L15.3,9.7L11.6,10L14.5,12.5L13.6,16L16.8,14L20,16L19,12.5L22,10L18.3,9.7L16.8,6.2Z"/>*/}
            {/*    </svg>*/}

            {/*    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="z-120">*/}
            {/*        <path class={documentState.theme.value == "light"*/}
            {/*                         ? "fill-foundry-50 transition-colors duration-200"*/}
            {/*                         : "fill-foundry-500 transition-colors duration-200"}*/}
            {/*              d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13"/>*/}
            {/*    </svg>*/}
            {/*</button>*/}
        </nav>
    );
});
