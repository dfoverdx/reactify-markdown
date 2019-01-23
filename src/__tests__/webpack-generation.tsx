import fs from 'fs';
import path from 'path';
import React from 'react';
import child_process from 'child_process';
import { shallow } from 'enzyme';
import packageJson from '../../package.json';
import ReactifyMarkdownSource from '../../types/reactify-markdown';

beforeAll(() => {
    const projectRoot = path.join(__dirname, '../..'),
        prodBuildFile = path.join(projectRoot, packageJson.main);
    let needToBuild = !fs.existsSync(prodBuildFile);

    if (!needToBuild) {
        const lastProdBuildDate = fs.statSync(prodBuildFile).mtime,
            skipPatterns: RegExp[] = [
                /__(tests|mocks)__|\.(test|spec)\.[tj]sx?$/i,   // jest test files
                /[\\\/]test$/i,                                 // enzyme setup -- not used by webpack
                /coverage$/i,                                   // jest code coverage output
                /\.nyc_output$/,                                // git history files
                /node_modules$/i,
                new RegExp(path.basename(packageJson.types) + '$', 'i'),
                /\.vscode$/i,
                /(dev-)?dist$/i,
                /\.git$/i,
                /\.package-lock\.json$/i,
                /README\.md$/i,
                /\.code-workspace$/i,
            ];
        
        const searchForNewer = function(curDir: string): boolean {
            const dirs: string[] = [],
                filePaths = fs.readdirSync(curDir).map(f => path.join(curDir, f));

            readFilesLoop:
            for (const filePath of filePaths) {
                for (const regex of skipPatterns) {
                    if (regex.test(filePath)) {
                        continue readFilesLoop;
                    }
                }
                
                if (fs.statSync(filePath).mtime > lastProdBuildDate) {
                    return true;
                }

                if (fs.lstatSync(filePath).isDirectory()) {
                    dirs.push(filePath);
                }
            }

            for (const dir of dirs) {
                if (searchForNewer(dir)) {
                    return true;
                }
            }

            return false;
        }

        needToBuild = searchForNewer(projectRoot);
    }

    if (needToBuild) {
        console.log('Prod build is out of date.  Building...');
        child_process.execSync('npm run build:prod', {
            cwd: projectRoot
        });
    }
});

it('loads the ReactifyMarkdown export', () => {
    const ReactifyMarkdown = require('../../dist').default,
        genComponent = () => shallow(<ReactifyMarkdown>Test</ReactifyMarkdown>);
    expect(genComponent).not.toThrow();
    expect(genComponent()).toMatchSnapshot();
});