import React, { Fragment } from 'react';
import classnames from 'classnames';
import { escapeHtml, unescapeAll } from 'markdown-it/lib/common/utils';
import { getAttrs } from './helpers';
import { MarkdownItRules } from './types';

/**
 * Reactified rules defined in markdown-it/lib/renderer.js.  May need to update these with future versions of
 * markdown-it.
 */
const default_rules: MarkdownItRules = {};

/**
 * Inline code block rule.
 */
default_rules.code_inline = function(tokens, idx) {
    let token = tokens[idx];
    return <code {...getAttrs(token)}>{token.content}</code>;
};

/**
 * Code block via preceding four spaces rule.
 */
default_rules.code_block = function(tokens, idx) {
    let token = tokens[idx];
    return (
        <pre {...getAttrs(token)}><code>{token.content}</code></pre>
    );
}

/**
 * Code block via fence rule.
 */
default_rules.fence = function(tokens, idx, options) {
    let token = tokens[idx],
        info = token.info ? unescapeAll(token.info).trim() : '',
        langName = '',
        highlighted: string;

    if (info) {
        langName = info.split(/\s+/g)[0];
    }

    console.assert(typeof token.content === 'string');

    if (options.highlight) {
        highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
    } else {
        highlighted = escapeHtml(token.content);
    }

    if (highlighted.indexOf('<pre') === 0) {
        return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
    }

    if (info) {
        let {
            className,
            ...attrs
        } = getAttrs(token);

        return (
            <pre>
                <code className={classnames(className, options.langPrefix + langName)} {...attrs}
                    dangerouslySetInnerHTML={{__html: highlighted}} />
            </pre>
        );
    }

    return (
        <pre>
            <code {...getAttrs(token)} dangerouslySetInnerHTML={{__html: highlighted}} />
        </pre>
    );
}

/**
 * Image rule.
 */
default_rules.image = function(tokens, idx, options, env, slf) {
    let token = tokens[idx],
        Tag = token.tag;

    token.attrs[token.attrIndex('alt')][1] =
        (slf as any).renderInlineAsText(token.children, options, env); // renderInlineAsText is private

    return <Tag {...getAttrs(token)} />;
}

/**
 * Hard-break `<br />` rule.
 */
default_rules.hardbreak = () => <Fragment><br />{'\n'}</Fragment>;

/**
 * Soft-break `<br />` rule.
 */
default_rules.softbreak = (_, _1, options) => 
    options.breaks ? <Fragment><br />{'\n'}</Fragment> : '\n';

/**
 * Unformatted text, html block, and html inline rules.
 *
 * All three rules are the same.  In the original `Renderer`, only `html_block` and `html_inline` were the same.
 * Unformatted text originally had its content escaped against HTML, but React handles that for us.
 */
default_rules.text = default_rules.html_block = default_rules.html_inline = function(tokens, idx) {
    return tokens[idx].content;
}

export default default_rules;