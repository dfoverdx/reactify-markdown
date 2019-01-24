import { ReactNode } from 'react';
import MarkdownIt from 'markdown-it';
import { Options } from 'markdown-it/lib/index';
import MDIToken from 'markdown-it/lib/token';

declare class ReactRenderer {
    rules: {
        [key: string]: TokenRender;
    };

    render(tokens: Token[], options: any, env: any): ReactNode;
};

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type MarkdownItPresetName = 'commonmark' | 'zero' | 'default';

/**
 * A MarkdownIt Token with the overloaded capacity to allow the `content` property to be a `ReactNode`.
 */
export interface Token extends Omit<MDIToken, 'content'> {
    content: ReactNode;
}

/**
 * Rule defintion that modifies the tokens of a `Token` stream.
 * 
 * @see https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#rules
 */
export type TokenRender = (tokens: Token[], idx: number, options: any, env: any, self: ReactRenderer) => 
    ReactNode | RenderedToken;

export class RenderedToken {
    constructor(public node: ReactNode, public endIdx: number) {}
}

/**
 * Key-value pairs of `TokenRender` rules.
 */
export interface MarkdownItRules {
    [key: string]: TokenRender;
}

export type Plugin = [(md: MarkdownIt, env: any) => void, ...any[]] | ((md: MarkdownIt, env: any) => void);

export interface ReactifyMarkdownProps<T extends 'md' | 'options'> {
    /**
     * The markdown source string to be parsed and rendered.
     */
    children: string;

    /**
     * Environment context.  Gets passed when evaluating rules, which may be helpful for rendering React components.
     */
    env: any;

    /**
     * By default, the component will strip preceding spaces via `strip-indent`.  Set this flag to disable this 
     * behavior.
     * 
     * @see https://github.com/sindresorhus/strip-indent
     */
    dontStripIndent: boolean;

    /**
     * The pre-configured `MarkdownIt` instance.
     */
    md: T extends 'md' ? MarkdownIt : never;

    /**
     * Optional rule name or list of rule names to enable.
     */
    enable?: T extends 'options' ? (string | string[]) : never;
    
    /**
     * Optional rule name or list of rule names to disable.
     */
    disable?: T extends 'options' ? (string | string[]) : never;

        /**
     * Options passed to the `MarkdownIt` constructor.
     * 
     * @see https://markdown-it.github.io/markdown-it/#MarkdownIt.new
     */
    options?: T extends 'options' ? Options : never;

    /**
     * List of plugins to apply to the `MarkdownIt` instance.
     * 
     * @warning Any plugin which overwrites the instance's renderer directly will cause an error.
     */
    plugins?: T extends 'options' ? (Plugin[] | Plugin) : never;

    /**
     * The preset name to use.
     * 
     * @default `"default"`
     * @see https://markdown-it.github.io/markdown-it/#MarkdownIt.new
     */
    presetName?: T extends 'options' ? MarkdownItPresetName : never;
}