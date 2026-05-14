export const component = <PARAMS>(
    renderFn: (params: PARAMS & { children?: JSX.Children }) => JSX.Component,
) => renderFn;

export const page = <PARAMS = Lume.Data>(
    renderFn: (params: PARAMS & { children?: JSX.Children }, helpers: Lume.Helpers) => JSX.Component,
) => renderFn;
