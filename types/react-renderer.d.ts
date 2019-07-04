import { ReactNode } from 'react';
import { RenderedToken, Token, TokenRender } from './types';
/**
 * Renderer that renders the converted source as React elements rather than an HTML string.
 */
export default class ReactRenderer {
    constructor(prevRules?: object);
    /**
     * Rules to use when parsing and rendering a source string.
     */
    rules: {
        [key: string]: TokenRender;
    };
    /**
     * Renders the passed token stream as React elements.
     *
     * @param tokens Token stream to be rendered as React elements.
     * @param options Options passed to Renderer rules.
     * @param env Environment passed to Renderer rules.
     */
    render(tokens: Token[], options: any, env: any): ReactNode;
    /**
     * Renders the token and the specified index within the token stream as a ReactNode.
     *
     * @param tokens Token stream to be rendered as React elements.
     * @param idx Index of token within tokens stream.
     * @param options Options passed to Renderer rules.
     * @param env Environment passed to Renderer rules.
     */
    renderToken(tokens: Token[], idx: number, options: any, env: any): RenderedToken;
    /**
     * No-Op.
     */
    renderAttrs(_: Token): void;
    /**
     * Does the woek of rendering.  Is in a separate function from `render` so that we can include the `idx` argument.
     *
     * @param tokens The token stream produced by the parser.
     * @param idx The index of the starting token to be rendered.  Is `0` when called by `render`, and greater when
     * being called recursively.
     * @param options Options passed to the Renderer instance.
     * @param env Environement passed to the Renderer instance.
     */
    private renderInner;
    renderInlineAsText(tokens: Token[], options: any, env: any): string;
}
