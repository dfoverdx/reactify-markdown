import React, { ReactNode } from 'react';
import default_rules from './default-rules';
import { getAttrs } from './helpers';
import { Token, TokenRender } from './types';

/**
 * Renderer that renders the converted source as React elements rather than an HTML string.
 */
export default class ReactRenderer {
    constructor(prevRules?: object) {
        this.rules = Object.assign({}, prevRules, default_rules);
    }

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
    render(tokens: Token[], options: any, env: any): ReactNode {
        return this.renderInner(tokens, 0, options, env)[0];
    }

    /**
     * Does the woek of rendering.  Is in a separate function from `render` so that we can include the `idx` argument.
     * 
     * @param tokens The token stream produced by the parser.
     * @param idx The index of the starting token to be rendered.  Is `0` when called by `render`, and greater when
     * being called recursively.
     * @param options Options passed to the Renderer instance.
     * @param env Environement passed to the Renderer instance.
     */
    private renderInner(tokens: Token[], idx: number, options: any, env: any): [ReactNode, number] {
        let rules = this.rules,
            nodes: ReactNode[] = [];

        for (let i = idx; i < tokens.length; i++) {
            let token = tokens[i],
                type = token.type;

            if (type === 'inline') {
                addNodeToArray(nodes, this.render(token.children, options, env));
            } else if (rules[type] !== undefined) {
                let n = rules[type](tokens, i, options, env, this);
                addNodeToArray(nodes, n);
            } else if (token.hidden) {
                continue;
            } else if (token.nesting === 1) {
                // opening tag which may or may not be followed by children
                let Tag = token.tag,
                    [n, j] = this.renderInner(tokens, i + 1, options, env);
                
                addNodeToArray(nodes, <Tag key={i} {...getAttrs(token)}>{n}</Tag>);
                i = j;
            } else if (token.nesting === 0) {
                // singleton tag, e.g. <img />
                let Tag = token.tag;
                addNodeToArray(nodes, <Tag key={i} {...getAttrs(token)} />);
            } else {
                // closing tag -- return at this point as it's either the last token in the stream, or it's the final
                // action of a recursive call
                return [nodes, i];
            }
        }

        return [nodes, tokens.length];
    }
}

/**
 * Intelligently appends `node` to `array`.  `ReactNode` may be an array of `ReactNode`s, so this helper function exists
 * to be called recursively, where `Array<ReactNode>.push` could not.
 * 
 * @param array The array to which the node should be appended.
 * @param node The `ReactNode` to be appended.
 */
function addNodeToArray(array: ReactNode[], node: ReactNode): void {
    let idx = array.length;
    if (node === null || node === undefined || typeof node === 'boolean') {
        return;
    }

    if (Array.isArray(node)) {
        for (let n of node) {
            addNodeToArray(array, n);
        }
        idx = array.length;
    } else if (React.isValidElement(node)) {
        if (node.key) {
            // assume the user knows what they're doing
            array.push(node);
        } else {
            array.push(React.cloneElement(node, { key: idx++ }));
        }
    } else {
        array.push(node);
    } 
}