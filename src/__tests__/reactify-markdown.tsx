import React from 'react';
import { shallow } from 'enzyme';
import mdiRegex from 'markdown-it-regex';
import ReactifyMarkdown from '../reactify-markdown';
import { Plugin } from '../types';

jest.mock('shortid');

test('It handles some basic rules', () => {
    let component = shallow(<ReactifyMarkdown>{`
        Header 1
        ========

        A paragraph starts here.  *This is italicized.*

            This is a code block.
    `}</ReactifyMarkdown>);

    expect(component).toMatchSnapshot();
});

test('It handles custom rules', () => {
    let plugins: Plugin[] = [[mdiRegex, {
            name: 'test',
            regex: /:(\w+):/,
            replace: (m: string) => <i>{m}</i>,
        }]];

    let component = shallow(<ReactifyMarkdown plugins={plugins}>{`
        Hay :needle: stack
    `}</ReactifyMarkdown>);

    expect(component).toMatchSnapshot();
})

test('It doesn\'t strip whitespace when it\'s set not to', () => {
    const md = `
    Header 1
    ========

    A paragraph starts here.  *This is italicized.*
    `;

    const component = shallow(<ReactifyMarkdown dontStripIndent>{md}</ReactifyMarkdown>);
    expect(component).toMatchSnapshot();
});