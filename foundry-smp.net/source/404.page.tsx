import {Main, Article, SiteToolbar, SiteHero, SiteFooter} from "@foundry/theme";
import {page} from "@foundry/engine";

export const title = "404 Not Found - Create Technical Foundry";

export default page(({topNavigation, basename}) => {
    return <>
        <SiteToolbar homeLabel="SMP" links={topNavigation}/>
        <SiteHero
            title="Ooops..."
            line="The URL you tried doesn't exist here!"
            class="pl-0"
        />
        <Main class="my-32">
            <h2 class="text-4xl font-bold tracking-wide">
                Unable to find what you are looking for
            </h2>
            <p class="mt-6 text-lg text-stone-400">
                The page at <code
                class="px-2 py-1 bg-stone-800 rounded text-foundry-500 font-mono text-base">/{basename}</code> couldn't
                be found. It may have moved, or never existed. Try:
            </p>
            <ul class="mt-6 space-y-3 ml-6">
                <li class="relative pl-6 text-stone-300 before:content-['→'] before:absolute before:left-0 before:text-foundry-500 before:font-bold">
                    Heading back to the <a href="/" class="text-foundry-500 hover:text-foundry-400 underline">Homepage</a>
                </li>
                <li class="relative pl-6 text-stone-300 before:content-['→'] before:absolute before:left-0 before:text-foundry-500 before:font-bold">
                    Solving the traveling salesman problem
                </li>
            </ul>
        </Main>
        <SiteFooter/>
    </>;
});