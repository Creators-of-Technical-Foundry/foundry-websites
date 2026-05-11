import { component$ } from "@builder.io/qwik";

export const SiteFooter = component$(() => (
    <footer class="text-center text-sm italic my-6 text-neutral-500 opacity-80 flex flex-row justify-between">
        <p>
            made by <a href="https://github.com/adaliszk" target="_blank">Kicsivazz</a> using Qwik with Hono
        </p>
        <p>
            last updated on <time class="text-xs">##LAST_UPDATE##</time>
        </p>
    </footer>
));
