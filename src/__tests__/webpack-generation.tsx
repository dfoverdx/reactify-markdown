import React from 'react';
import { shallow } from 'enzyme';
import ReactifyMarkdown from '../../dist';

test('It loads the ReactifyMarkdown export', () => {
    const genComponent = () => shallow(<ReactifyMarkdown>Test</ReactifyMarkdown>);
    expect(genComponent).not.toThrow();
});