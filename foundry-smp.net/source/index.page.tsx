import { component$, useSignal } from "@qwik.dev/core";
import { twMerge } from "@tailwindcss/merge";

export const title = "Create Technical Foundry";

export default component$<Lume.Data>(function IndexPage() {
    const counter = useSignal(0);
    const buttonStyle = twMerge(
        "w-12 cursor-pointer select-none",
        "transition-color bg-blueprint-200/20 hover:bg-blueprint-200/40 active:bg-blueprint-200/60 text-blueprint-200",
        "transition-transform scale-100 active:scale-90",
    );
    const articleStyle = twMerge(
        "rounded-xl border-blueprint-100 border-2 border-r-6 border-b-6 bg-blueprint-900",
        "mt-16 p-12",
    );

    return (
        <main class="w-8/12 mx-auto py-24 text-center grid grid-cols-5 gap-12">
            <article class={twMerge(articleStyle, "col-span-3")}>
                <h1 class="text-2xl font-bold">Hello, Qwik on Lume!</h1>
                <section class="flex flex-row w-fit mx-auto mt-12 items-center justify-center">
                    <img src="/assets/qwik.svg" alt="Qwik" class="h-32" />
                    <div class="w-32">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="scale-50">
                            <title>plus</title>
                            <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                        </svg>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 422 443" class="h-32 mt-4" fill="none">
                        <path fill="#e05252"
                              d="M271.4 255.5c0 67.103-60.5 121.5-60.5 121.5s-60.5-54.397-60.5-121.5S210.9 134 210.9 134s60.5 54.397 60.5 121.5"/>
                        <path fill="currentColor"
                              d="M336.703 168.186c43.132 51.403 31.753 131.963 31.753 131.963s-81.312-2.782-124.445-54.186S212.258 114 212.258 114s81.312 2.782 124.445 54.186"/>
                        <path fill="currentColor"
                              d="M177.79 245.963c-43.133 51.404-124.444 54.186-124.444 54.186s-11.38-80.56 31.753-131.963C128.23 116.782 209.543 114 209.543 114s11.38 80.559-31.753 131.963M154.501 0a47.5 47.5 0 0 1 47.501 47.501 4 4 0 0 1-8 0 39.5 39.5 0 0 0-30.041-38.35c.023.28.039.563.039.849 0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10q.136 0 .271.006.114-.006.23-.006M268.002 0c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10q.002-.429.038-.849a39.5 39.5 0 0 0-18.471 10.418A39.5 39.5 0 0 0 228 47.501a4 4 0 0 1-8 0A47.504 47.504 0 0 1 267.501 0q.116 0 .229.006.136-.005.272-.006"/>
                        <path fill="currentColor" d="M251 65c0 22.091-17.909 70-40 70s-40-47.909-40-70 17.909-40 40-40 40 17.909 40 40"/>
                        <circle cx="211.5" cy="271.5" r="171.5" fill="url(#a)" class="logo-light" opacity=".6"/>
                        <path fill="currentColor"
                              d="M135.834 216.259C78.928 251.818.736 229.337.736 229.337s14.072-80.133 70.978-115.692 135.098-13.078 135.098-13.078-14.071 80.133-70.978 115.692M350.419 113.643c56.906 35.559 70.978 115.692 70.978 115.692s-78.192 22.481-135.098-13.078-70.978-115.693-70.978-115.693 78.192-22.48 135.098 13.079"/>
                        <defs>
                            <radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="rotate(90 -30 241.5)scale(171.5)"
                                            gradientUnits="userSpaceOnUse">
                                <stop stop-color="#e05252" offset="0"/>
                                <stop offset="1" stop-color="#e05252" stop-opacity="0"/>
                            </radialGradient>
                        </defs>
                    </svg>
                </section>
            </article>
            <article class={twMerge(articleStyle, "col-span-2")}>
                <p class="mb-4 font-semibold">
                    A key concept of Qwik applications is that they are resumable from a server-side-rendered state.
                </p>
                <p class="mb-4 font-semibold">
                    See how it behaves even on SSG without any server or hydration:
                </p>
                <section class="flex flex-row w-fit h-12 mx-auto mt-6 items-stretch justify-center">
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
                    <code class="bg-blueprint-100/10 text-2xl font-extrabold flex items-center justify-center w-24">{counter.value}</code>
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
            </article>
        </main>
    );
});
