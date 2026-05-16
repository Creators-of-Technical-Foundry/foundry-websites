import { component$, useSignal } from "@qwik.dev/core";
import { twMerge } from "@tailwindcss/merge";

export const title = "Create Technical Foundry";

export default component$<Lume.Data>(function IndexPage() {
    const counter = useSignal(0);
    const buttonStyle = twMerge(
        "w-12 cursor-pointer select-none",
        "transition-color bg-foundry-500/10 hover:bg-foundry-900/20 active:bg-foundry-900/30",
        "transition-transform scale-100 active:scale-90",
    )

    return (
        <main class="w-3/12 mx-auto py-24 text-center">
            <h1 class="text-2xl">Hello, Qwik!</h1>
            <p>See resumed interactivity here:</p>
            <section class="flex flex-row w-fit h-12 mx-auto mt-6 justify-center">
                <button
                    type="button"
                    class={twMerge(buttonStyle, "rounded-l-lg")}
                    onClick$={() => counter.value--}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" class="scale-50">
                        <title>minus</title>
                        <path fill="currentColor" d="M17 12H5V10H17Z" />
                    </svg>
                </button>
                <code class="bg-foundry-900/10 text-lg flex items-center justify-center w-24">{counter.value}</code>
                <button
                    type="button"
                    class={twMerge(buttonStyle, "rounded-r-lg")}
                    onClick$={() => counter.value++}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="scale-50">
                        <title>plus</title>
                        <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </button>
            </section>
        </main>
    );
});
