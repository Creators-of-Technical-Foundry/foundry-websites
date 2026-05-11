import { component$, useContext } from "@qwik.dev/core";
import { DocumentContext } from "@foundry/website/server";

export type SiteToolbarProps = {
    homeLabel?: string;
    links?: Array<{
        label: string;
        href: string;
    }>
}

export const SiteToolbar = component$<SiteToolbarProps>((props) => {
    const documentState = useContext(DocumentContext);
    return (
        <nav class="w-9/10 xl:w-6xl fixed top-0 left-1/2 -translate-x-[50%] h-18 z-150 flex flex-row gap-3 mx-5 justify-between items-center">
            <a href="/" class="flex flex-row gap-3 items-center">
                <img width={32} height={32} src="/logo-favicon.png" alt="C:TF" />
                <span class="inline-block ml-2">{props.homeLabel ?? 'Foundry'}</span>
            </a>
            {(props.links ?? []).map((link) => (
                <>
                    <span class="text-foundry-300">/</span>
                    <a href={link.href}>{link.label}</a>
                </>

            ))}
            <div class="grow"></div>
            <button type="button" onClick$={() => documentState.theme.value = documentState.theme.value === 'light' ? 'dark' : 'light'}>
                {documentState.theme.value}
            </button>
        </nav>
    );
});
