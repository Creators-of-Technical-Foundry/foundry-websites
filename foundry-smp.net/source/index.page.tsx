// import { fragment } from "@foundry/engine/server";
// import { Main, Article, SiteFooter, SiteHero, SiteToolbar } from "@foundry/theme";
// import SiteLinks from "../deno.topnav.ts";

export const title = "Foundry SMP";
export const layout = "layout.tsx";

export default () => {
    return (
        <header>
            <h1>Hello, Lume!</h1>
        </header>
    );
};

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
//                 <section class="grid grid-cols-3 grid-rows-1 gap-4">
//                     <Article>
//                         <h3 class="font-bold text-lg">Modpack</h3>
//                         <p>Use our lightweight pack and creative space for your experiments!</p>
//                     </Article>
//                     <Article>
//                         <h3 class="font-bold text-lg">Schematics</h3>
//                         <p>Find factory modules, utility components, or the best machines!</p>
//                     </Article>
//                     <Article>
//                         <h3 class="font-bold text-lg">Wiki</h3>
//                         <p>
//                             Explore the various technical behaviours, tricks, and design patterns!
//                         </p>
//                     </Article>
//                 </section>
//                 <section class="grid grid-cols-3 gap-4">
//                 </section>
//             </Main>
//             <SiteFooter />
//         </>
//     );
// });
