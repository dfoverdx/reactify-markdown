import { ReactNode } from 'react';
import MarkdownIt from 'markdown-it';
import MDIToken from 'markdown-it/lib/token';
import ReactRenderer from './react-renderer';
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
/**
 * A MarkdownIt Token with the overloaded capacity to allow the `content` property to be a `ReactNkde`.
 */
export interface Token extends Omit<MDIToken, 'content'> {
    content: ReactNode;
}
/**
 * Rule defintion that modifies the tokens of a `Token` stream.
 *
 * @see https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#rules
 */
export declare type TokenRender = (tokens: Token[], idx: number, options: any, env: any, self: ReactRenderer) => ReactNode;
/**
 * Key-value pairs of `TokenRender` rules.
 */
export interface MarkdownItRules {
    [key: string]: TokenRender;
}
export declare type Plugin = [(md: MarkdownIt, env: any) => void, ...any[]];
export {};
