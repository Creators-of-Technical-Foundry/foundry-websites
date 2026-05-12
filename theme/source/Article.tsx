import { component$, Slot } from "@qwik.dev/core";
import { twMerge } from "tailwind-merge";

export type ArticleProps = {
    class?: string;
};

export const Article = component$<ArticleProps>((props) => {
    const styles = twMerge(
        "w-full p-6 bg-stone-300 dark:bg-stone-800 rounded-md shadow-md",
        props.class,
    );

    return (
        <article class={styles} {...props}>
            <Slot />
        </article>
    );
});
