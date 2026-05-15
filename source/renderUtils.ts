export const component = <PARAMS>(
    renderFn: (params: PARAMS & { children?: JSX.Children }) => Promise<JSX.Component>|JSX.Component,
) => renderFn;

export const page = <PARAMS = Lume.Data>(
    renderFn: (params: PARAMS & { children?: JSX.Children }, helpers: Lume.Helpers) => Promise<JSX.Component>|JSX.Component,
) => renderFn;
