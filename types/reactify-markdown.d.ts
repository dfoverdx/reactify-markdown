import { PureComponent } from 'react';
import MD from 'markdown-it';
import { MarkdownItPresetName, ReactifyMarkdownProps as Props } from './types';
interface State {
    md: MD;
}
export default class ReactifyMarkdown<TProps extends Props<'md'> | Props<'options'>> extends PureComponent<TProps, State> {
    constructor(props: TProps);
    componentDidUpdate(nextProps: TProps, nextState: State): void;
    private generateState;
    render(): string;
    static defaultProps: Partial<Props<'options'> | Omit<Props<'md'>, 'presetName'>> & {
        presetName: MarkdownItPresetName;
    };
}
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export {};
