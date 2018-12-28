import MarkdownIt from 'markdown-it';
import ReactRenderer from './react-renderer';
import './types';

export { default as ReactRenderer } from './react-renderer';
export * from './types';
export { default } from './reactify-markdown';

/**
 * Plugin that replaces the MarkdownIt instance's `renderer` with one that renders to `ReactNode`s.
 * @param md MarkdownIt instance.
 */
export function RenderReactPlugin(md: MarkdownIt): void {
    (md as any).renderer = new ReactRenderer();
}