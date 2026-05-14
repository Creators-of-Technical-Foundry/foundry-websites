import { component } from "@foundry/engine";
import { twMerge } from "@tailwindcss/merge";

export const Main = component<{ class?: string }>(({ children, class: classList }) => (
    <main
        class={twMerge(
            "w-11/12 mx-auto relative z-80 h-full grow my-12 px-6 flex-col flex-wrap space-y-4",
            classList?.toString(),
        )}
    >
        {children}
    </main>
));
