Reactify Markdown
=================

A [MarkdownIt](https://github.com/markdown-it/markdown-it) plugin and corresponding React component that makes the
renderer produce React Nodes instead of a string.

Every React/Markdown package I've found has rendered the source as text and then wrapped it in 
`<div dangerouslySetInnerHTML={{__html: source}} />`.  This prevents you from creating rules and plugins that return
controlled React components.  It also produces a `<div>`, a block-level element, which can have undesired effects on layout.

Using custom rules that set `token.content` to a `ReactNode` allows you to render React components inline.  As the `env`
parameter of `render()` can pass arbitrary information, you can take advantage of this and pass component props and
state into the markdown rendering itself.

Installation
------------

```bash
npm install --save reactify-markdown react markdown-it
```

React and markdown-it are required peer dependencies.

Usage
-----

### Using just the plugin

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import { RenderReactPlugin } from 'reactify-markdown';

const md = MarkdownIt();
md.use(RenderReactPlugin);

function MyComponent({ myMarkdownString }) { 
    return (<div>
        Here's my markdown!
        {md.render(myMarkdownString)}
    </div>);
}

ReactDOM.render(
    <MyComponent myMarkdownString="# Hello #" />, 
    document.getElementById('root')
);
```

Produces:

```html
<div>
    Here's my markdown!
    <h1>Hello</h1>
</div>
```

#### With a custom rule ####

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import mdiRegex from 'markdown-it-regex';
import { RenderReactPlugin } from 'reactify-markdown';

const md = MarkdownIt();
md.use(RenderReactPlugin);
md.use(mdiRegex, {
    name: 'myRule',
    regex: /:(\w+):/,
    replace: m => <i>{m}</i>
});

function MyComponent({ myMarkdownString }) { 
    return md.render(myMarkdownString);
}

ReactDOM.render(
    <MyComponent myMarkdownString="Hay :needle: stack" />, 
    document.getElementById('root')
);
```

Produces:

```html
<p>
    Hay <i>needle</i> stack
</p>
```

### Using the React Component ###

The same outputs as above can be produced using:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import ReactifyMarkdown from 'reactify-markdown';

ReactDOM.render(
    <div>
        Here's my markdown!
        <ReactifyMarkdown>
            # Hello #
        </ReactifyMarkdown>
    </div>,
    document.getElementById('root')
);
```

#### With a custom rule ####

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import mdiRegex from 'markdown-it-regex';
import ReactifyMarkdown from 'reactify-markdown';

const myRule = [
    mdiRegex, 
    {
        name: 'myRule',
        regex: /:(\w+):/,
        replace: m => <i>{m}</i>
    }
];

ReactDOM.render(
    <ReactifyMarkdown plugins={[myRule]}>Hay :needle: stack</ReactifyMarkdown>,
    document.getElementById('root')
);
```

#### `<ReactifyMarkdown>` props ####

*   `children`: `string` - The markdown source string to be parsed and rendered.
*   `enable?`: `string | string[]` - Optional rule name or list of rule names to enable.
*   `disable?`: `string | string[]` - Optional rule name or list of rule names to disable.
*   `env?`: `any` - Arbitrary data that is passed into the renderer's rules.
*   `dontStripIndent?`: `boolean` (default `false`) - By default, the component will strip preceding spaces via
    [`strip-indent`](https://github.com/sindresorhus/strip-indent).  Set this flag to disable this behavior.
*   `md?`: `MarkdownIt` - A preconfigured markdown it instance.  **If `md` is set, all of the following values are
    ignored.**
*   `options?`: `MarkdownIt.Options` - See https://markdown-it.github.io/markdown-it/#MarkdownIt.new.
*   `plugins?`: `Plugin[]` - A list of plugins to apply to the markdown instance.  Each element is passed directly as
    arguments to `md.use()`.  See https://markdown-it.github.io/markdown-it/#MarkdownIt.use.
*   `presetName?`: `'commonmark' | 'zero' | 'default'` (default `'default'`) - See https://markdown-it.github.io/markdown-it/#MarkdownIt.new.

TODO
----

* [ ] Better documentation.
* [ ] Allow mixed strings/elements children in the `<ReactifyMarkdown>` component.
* [ ] Better test coverage.
