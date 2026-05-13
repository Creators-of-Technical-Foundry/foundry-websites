import { type QwikIntrinsicElements, component$, Slot } from "@qwik.dev/core";
import { twMerge } from "tailwind-merge";

export type ArticleProps = QwikIntrinsicElements["article"];

// noinspection JSUnusedGlobalSymbols - Used by Domains
export const Article = component$<ArticleProps>(({ class: classList, ...props }) => {
    const styles = twMerge(
        "w-full p-6 bg-stone-300 dark:bg-stone-800 rounded-md shadow-md",
        classList?.toString(),
    );

    return (
        <article class={styles} {...props}>
            <Slot />
        </article>
    );
});
