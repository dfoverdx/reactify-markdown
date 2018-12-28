import { ReactNode } from 'react';
import MDIToken from 'markdown-it/lib/token';
import { Token, TokenRender } from './types';
/**
 * Renderer that renders the converted source as React elements rather than an HTML string.
 */
export default class ReactRenderer {
    constructor();
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
     * @param env Environment passed to Renderee rules.
     */
    render(tokens: Token[], options: any, env: any): ReactNode;
    /**
     * Renders the passed MarkdownIt tokens.
     *
     * @deprecated Use JSX Rendered tokens instead, as their `content` property can store React components.
     */
    render(tokens: MDIToken[], options: any, env: any): string;
    /**
     * Does the woek of rendering.  Is in a separate function from `render` so that we can include the `idx` argument.
     *
     * @param tokens The token stream produced by the parser.
     * @param keyPrefix A prefix for element keys.
     * @param idx The index of the starting token to be rendered.  Is `0` when called by `render`, and greater when
     * being called recursively.
     * @param options Options passed to the Renderer instance.
     * @param env Environement passed to the Renderer instance.
     */
    private renderInner;
}
