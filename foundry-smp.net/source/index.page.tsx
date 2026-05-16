import { useSignal, component$ } from "@foundry/preset";

export const title = "Create Technical Foundry";

export default component$<Lume.Data>(function IndexPage() {
    const counter = useSignal(0);

    return (
        <main class="w-10/12 mx-auto">
            <h1>Hello, Qwik!</h1>

            <h3>Counter Example</h3>
            <section class="flex flex-col h-12 w-full items-stretch justify-stretch my-4 gap-2">
                <button type="button" onClick$={() => counter.value--}>-</button>
                <code>{counter.value}</code>
                <button type="button" onClick$={() => counter.value++}>+</button>
            </section>
        </main>
    );
});
