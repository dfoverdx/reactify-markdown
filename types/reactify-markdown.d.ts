import { PureComponent } from 'react';
import MD from 'markdown-it';
import { Options } from 'markdown-it/lib/index';
import { Plugin } from './types';
interface BaseProps {
    /**
     * The markdown source string to be parsed and rendered.
     */
    children: string;
    /**
     * Optional rule name or list of rule names to enable.
     */
    enable?: string | string[];
    /**
     * Optional rule name or list of rule names to disable.
     */
    disable?: string | string[];
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
}
interface MdProps extends BaseProps {
    /**
     * The pre-configured `MarkdownIt` instance.
     */
    md: MD;
}
interface OptionsProps extends BaseProps {
    /**
     * Options passed to the `MarkdownIt` constructor.
     *
     * @see https://markdown-it.github.io/markdown-it/#MarkdownIt.new
     */
    options?: Options;
    /**
     * List of plugins to apply to the `MarkdownIt` instance.
     *
     * @warning Any plugin which overwrites the instance's renderer directly will cause an error.
     */
    plugins?: Plugin[] | Plugin;
    /**
     * The preset name to use.
     *
     * @default `"default"`
     * @see https://markdown-it.github.io/markdown-it/#MarkdownIt.new
     */
    presetName: 'commonmark' | 'zero' | 'default';
}
interface State {
    md: MD;
}
export default class ReactifyMarkdown<TProps extends MdProps | OptionsProps> extends PureComponent<TProps, State> {
    constructor(props: TProps);
    componentDidUpdate(nextProps: TProps, nextState: State): void;
    private generateState;
    render(): string;
    static defaultProps: Partial<MdProps & OptionsProps>;
}
export {};
