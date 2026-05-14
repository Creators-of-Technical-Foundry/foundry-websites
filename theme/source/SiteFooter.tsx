import { type JSX, fragment } from "@foundry/engine/server";

export type SiteFooterProps = JSX.IntrinsicElements["header"] & {
    owner?: string;
};

export const SiteFooter = fragment<SiteFooterProps>(({ owner }) => (
    <footer class="w-11/12 mx-auto text-center text-sm italic my-6 text-neutral-500 opacity-80 flex flex-row justify-between">
        <p>
            made by <a href="https://github.com/adaliszk" target="_blank">Kicsivazz</a> using Hono with Qwik islands
        </p>
        <p>
            copyright &copy; 2025-2026 {owner ?? 'the Foundry team'}
        </p>
    </footer>
));
