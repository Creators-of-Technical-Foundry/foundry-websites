import { type JSX, type PropsWithChildren, fragment } from "@foundry/engine/server";
import { twMerge } from "tailwind-merge";

export type MainProps = JSX.IntrinsicElements["main"] & PropsWithChildren;

// noinspection JSUnusedGlobalSymbols - Used by Domains
export const Main = fragment<MainProps>(({ children, class: classList, ...props }) => {
    const styles = twMerge(
        "w-11/12 mx-auto relative z-80 h-full grow mt-24 px-6 flex-col flex-wrap space-y-4",
        classList?.toString(),
    );

    return (
        <main class={styles} {...props}>
            {children}
        </main>
    );
});