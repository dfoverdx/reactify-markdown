import MarkdownIt from 'markdown-it';
import './types';
export { default as ReactRenderer } from './react-renderer';
export * from './types';
export { default } from './reactify-markdown';
/**
 * Plugin that replaces the MarkdownIt instance's `renderer` with one that renders to `ReactNode`s.
 * @param md MarkdownIt instance.
 */
export declare function RenderReactPlugin(md: MarkdownIt): void;
