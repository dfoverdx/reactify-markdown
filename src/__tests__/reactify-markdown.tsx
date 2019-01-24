import React from 'react';
import { render, shallow } from 'enzyme';
import MD from 'markdown-it';
import mdiRegex from 'markdown-it-regex';
import MarkdownItUnderline from 'markdown-it-underline';
import ReactifyMarkdown from '../reactify-markdown';
import { Plugin } from '../types';

const customPlugins: Plugin[] = [[mdiRegex, {
    name: 'test',
    regex: /:(\w+):/,
    replace: (m: string) => <i>{m}</i>,
}]];

it('handles some basic rules', () => {
    let component = shallow(<ReactifyMarkdown>{`
        Header 1
        ========

        A paragraph starts here.  *This is italicized.*

            This is a code block.
    `}</ReactifyMarkdown>);

    expect(component).toMatchSnapshot();
});

it('handles custom rules', () => {
    let component = shallow(<ReactifyMarkdown plugins={customPlugins}>{`
        Hay :needle: stack
    `}</ReactifyMarkdown>);

    expect(component).toMatchSnapshot();
});

it('doesn\'t strip whitespace when it\'s set not to', () => {
    const md = `
    Header 1
    ========

    A paragraph starts here.  *This is italicized.*
    `;

    const component = shallow(<ReactifyMarkdown dontStripIndent>{md}</ReactifyMarkdown>);
    expect(component).toMatchSnapshot();
});

it('properly handles new-lines', () => {
    const md = `
    This is a paragraph.
    It does not have a newline.

    This is a paragraph.  
    It does have a newline.
    `;

    const component = shallow(<ReactifyMarkdown>{md}</ReactifyMarkdown>);
    expect(component).toMatchSnapshot();
});

it('handles passing an instance of markdown-it to props', () => {
    const md = new MD();
    
    for (const plugin of customPlugins) {
        const [p, ...options] = plugin;
        md.use(p, ...options);
    }

    let component = shallow(<ReactifyMarkdown md={md}>{`
            Hay :needle: stack
        `}</ReactifyMarkdown>);
    expect(component).toMatchSnapshot();
});

it('uses props specified by overwriting ReactifyMarkdown.defaultProps', () => {
    const defaultProps = ReactifyMarkdown.defaultProps,
        warn = console.warn;
    try {
        console.warn = jest.fn();

        ReactifyMarkdown.defaultProps = Object.assign({ plugins: customPlugins }, ReactifyMarkdown.defaultProps);
        let component = render(<ReactifyMarkdown>{`
                Hay :needle: stack
            `}</ReactifyMarkdown>);

        expect(component).toMatchSnapshot();
        expect(console.warn).not.toHaveBeenCalled();
        (console.warn as jest.Mock).mockReset();

        const md = new MD();
        md.use(mdiRegex, {
            name: 'test',
            regex: /:(\w+):/,
            replace: (m: string) => <em>{m}</em>,
        });

        ReactifyMarkdown.defaultProps.md = md;

        component = render(<ReactifyMarkdown>{`
                Hay :needle: stack
            `}</ReactifyMarkdown>);

        expect(component).toMatchSnapshot();
        expect(console.warn).toHaveBeenCalled();
        (console.warn as jest.Mock).mockReset();

        delete ReactifyMarkdown.defaultProps.plugins;

        component = render(<ReactifyMarkdown>{`
                Hay :needle: stack
            `}</ReactifyMarkdown>);

        expect(component).toMatchSnapshot();
        expect(console.warn).not.toHaveBeenCalled();
        (console.warn as jest.Mock).mockReset();

        component = render(<ReactifyMarkdown plugins={customPlugins}>{`
                Hay :needle: stack
            `}</ReactifyMarkdown>);

        expect(component).toMatchSnapshot();
        expect(console.warn).toHaveBeenCalled();
    } finally {
        ReactifyMarkdown.defaultProps = defaultProps;
        console.warn = warn;
    }
});

it('handles cases where a plugin calls `renderToken`', () => {
    let component = shallow(<ReactifyMarkdown plugins={MarkdownItUnderline}>{`
            _This is underlined._  This is not.  _This is underlined, too._
        `}</ReactifyMarkdown>);

    expect(component).toMatchSnapshot();
});