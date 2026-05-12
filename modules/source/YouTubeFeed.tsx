import { component$ } from "@qwik.dev/core";

export type YouTubeFeedProps = {
    channels: string[];
    filter?: (video: any) => boolean;
};

export const YouTubeFeed = component$<YouTubeFeedProps>(async () => {
});
