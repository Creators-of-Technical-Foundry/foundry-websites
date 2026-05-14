import { component } from "@foundry/engine";
import { twMerge } from "@tailwindcss/merge";

export const Article = component<{ class?: string }>(({ children, class: classList }) => (
    <article
        class={twMerge(
            "w-full p-6 bg-stone-300 dark:bg-stone-800 rounded-md shadow-md",
            classList?.toString(),
        )}
    >
        {children}
    </article>
));
