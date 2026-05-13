import { component$ } from "@qwik.dev/core";

export const SiteFooter = component$(() => (
    <footer class="w-11/12 mx-auto text-center text-sm italic my-6 text-neutral-500 opacity-80 flex flex-row justify-between">
        <p>
            made by <a href="https://github.com/adaliszk" target="_blank">Kicsivazz</a> using Qwik with Hono
        </p>
        <p>
            copyright &copy; 2025-2026 the Foundry team
        </p>
    </footer>
));
