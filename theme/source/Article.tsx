import { type JSX, type PropsWithChildren, fragment } from "@foundry/engine/server";
import { twMerge } from "tailwind-merge";

export type ArticleProps = JSX.IntrinsicElements["article"] & PropsWithChildren;

// noinspection JSUnusedGlobalSymbols - Used by Domains
export const Article = fragment<ArticleProps>(({ children, class: classList, ...props }) => {
    const styles = twMerge(
        "w-full p-6 bg-stone-300 dark:bg-stone-800 rounded-md shadow-md",
        classList?.toString(),
    );

    return (
        <article class={styles} {...props}>
            {children}
        </article>
    );
});
