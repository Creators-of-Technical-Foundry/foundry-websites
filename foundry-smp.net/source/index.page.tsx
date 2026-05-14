// import { fragment } from "@foundry/engine/server";
// import { Main, Article, SiteFooter, SiteHero, SiteToolbar } from "@foundry/theme";
// import SiteLinks from "../deno.topnav.ts";

import {Main, Article, SiteToolbar, SiteHero, SiteFooter} from "@foundry/theme";
import {page} from "@foundry/engine";
import videoFeed from "./index.data.ts";

export const title = "Create Technical Foundry";

export default page(({topNavigation}) => {
    return <>
        <SiteToolbar homeLabel="SMP" links={topNavigation}/>
        <SiteHero title="Technical Create Mod" line="Engineering factories and stretching the limits"/>
        <Main>
            <section class="flex flex-row gap-5 mx-4 px-4 pb-4 mt-12 border-b-4 border-dotted border-foundry-900/10">
                <h2 class="text-lg">All Videos</h2>
                <div class="grow" />
                <p>Chronological Order</p>
            </section>
            <section class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-5 gap-4">
                {videoFeed.map((entry) => (
                    <Article class="p-0 overflow-hidden cursor-pointer">
                        <a href={`https://youtu.be/${entry.video}?utm_source=foundry-smp-website&utm_medium=homepage`} target="_blank" class="flex flex-col">
                            <img src={`https://img.youtube.com/vi/${entry.video}/maxresdefault.jpg`} alt={"..."} height="332" />
                            <h3 class="p-4 text-xl font-bold">{entry.title}</h3>
                        </a>
                    </Article>
                    ))}
            </section>
        </Main>
        <SiteFooter/>
    </>;
});

// export default fragment(function HomePage(params) {
//     console.log('~~~ Home.page.tsx called!', params);
//
//     return (
//         <>
//             <title>Create: Technical Foundry</title>
//             <SiteToolbar homeLabel="SMP" links={SiteLinks} />
//             <SiteHero
//                 title="Technical Foundry"
//                 line="Engineering aesthetic factories with the Create Mod"
//             />
//             <Main>

//                 <section class="grid grid-cols-3 gap-4">
//                 </section>
//             </Main>
//             <SiteFooter />
//         </>
//     );
// });
