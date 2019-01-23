import MarkdownIt from 'markdown-it';
import ReactRenderer from './react-renderer';

/**
 * Plugin that replaces the MarkdownIt instance's `renderer` with one that renders to `ReactNode`s.
 * @param md MarkdownIt instance.
 */
export default function RenderReactPlugin(md: MarkdownIt): void {
    const currentRenderer = (md as any).renderer;
    (md as any).renderer = new ReactRenderer(currentRenderer.rules);
}