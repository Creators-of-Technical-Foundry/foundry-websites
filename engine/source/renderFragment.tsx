import type { HonoComponent } from "./types.ts";

export function fragment<PROPS>(onMount: HonoComponent<PROPS>): HonoComponent<PROPS> {
    return onMount;
}
