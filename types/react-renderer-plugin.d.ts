import MarkdownIt from 'markdown-it';
/**
 * Plugin that replaces the MarkdownIt instance's `renderer` with one that renders to `ReactNode`s.
 * @param md MarkdownIt instance.
 */
export default function RenderReactPlugin(md: MarkdownIt): void;
