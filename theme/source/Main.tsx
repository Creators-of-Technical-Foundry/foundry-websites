import { type QwikIntrinsicElements, component$, Slot } from "@qwik.dev/core";
import { twMerge } from "tailwind-merge";

export type MainProps = QwikIntrinsicElements["main"];

// noinspection JSUnusedGlobalSymbols - Used by Domains
export const Main = component$<MainProps>(({ class: classList, ...props }) => {
    const styles = twMerge(
        "w-11/12 mx-auto relative z-80 h-full grow mt-24 px-6 flex-col flex-wrap space-y-4",
        classList?.toString(),
    );

    return (
        <main class={styles} {...props}>
            <Slot />
        </main>
    );
});