// import { fragment } from "@foundry/engine/server";
// import { Main, Article, SiteFooter, SiteHero, SiteToolbar } from "@foundry/theme";
// import SiteLinks from "../deno.topnav.ts";

import { Article, Main, SiteFooter, SiteHero, SiteToolbar } from "@foundry/theme";
import { component, page } from "@foundry/engine";

export const title = "Create Technical Foundry";

const currentPath = Deno.realPathSync(new URL('.', import.meta.url));

export const VideoToolbar = component(() => {
    return (
        <section class="flex flex-row gap-5 mx-4 px-4 pb-4 mt-12 border-b-4 border-dotted border-foundry-900/10">
            <h2 class="text-lg">All Videos</h2>
            <div class="grow" />
            <p>Chronological Order</p>
        </section>
    )
})

export const VideoFeed = component(async () => {
    const data = await import("./index.data.ts");
    for (const video of data.default) {
        const videoImage = `${currentPath}/assets/videos/${video.id}.jpg`;
        if (!(await Deno.stat(videoImage).then(s => s.isFile).catch(() => false))) {
            console.log(`Downloading Thumbnail to ${videoImage}...`)
            const onlineImage = await fetch(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`);
            await Deno.writeFile(videoImage, await onlineImage.bytes(), { createNew: true });
        }
    }

    return (
        <section class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 4xl:grid-cols-5 gap-4">
            {data.default.map((entry) => (
                <Article class="p-0 overflow-hidden cursor-pointer">
                    <a
                        href={`https://youtu.be/${entry.id}?utm_source=foundry-smp-website&utm_medium=homepage`}
                        target="_blank"
                        class="flex flex-col"
                    >
                        <img
                            src={`/assets/videos/${entry.id}.jpg`}
                            alt="..."
                            height="332"
                            transform-images="avif webp jpg 640@2"
                        />
                        <h3 class="p-4 text-xl font-bold">{entry.title}</h3>
                    </a>
                </Article>
            ))}
        </section>
    )
})

export default page(({ topNavigation }) => {
    return (
        <>
            <SiteToolbar homeLabel="" links={topNavigation} />
            <SiteHero title="Technical Create Mod" line="Engineering factories and stretching the limits" />
            <Main>
                <VideoToolbar />
                <VideoFeed />
            </Main>
            <SiteFooter />
        </>
    );
});