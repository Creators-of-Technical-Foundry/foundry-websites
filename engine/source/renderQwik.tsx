/**
 * @jsxImportSource @qwik.dev/core
 */
import type { QwikComponent } from './types.ts'
// @jsxImportSource @qwik.dev/core
import { renderToString } from '@qwik.dev/core/server';

export type QwikProps = {
    of: QwikComponent
}

export const Qwik = async ({ of: QwikFragment }: QwikProps): Promise<string> => {
    return (await renderToString(<QwikFragment />)).html
};