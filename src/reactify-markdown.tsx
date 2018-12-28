import React, { PureComponent } from 'react';
import MD from 'markdown-it';
import { Options } from 'markdown-it/lib/index';
import stripIndent from 'strip-indent';
import RenderReactPlugin from './react-renderer-plugin';
import { Plugin } from './types';

interface BaseProps {
    /**
     * The markdown source string to be parsed and rendered.
     */
    children: string;

    /**
     * Optional rule name or list of rule names to enable.
     */
    enable?: string | string[];
    
    /**
     * Optional rule name or list of rule names to disable.
     */
    disable?: string | string[];

    /**
     * Environment context.  Gets passed when evaluating rules, which may be helpful for rendering React components.
     */
    env: any;

    /**
     * By default, the component will strip preceding spaces via `strip-indent`.  Set this flag to disable this 
     * behavior.
     * 
     * @see https://github.com/sindresorhus/strip-indent
     */
    dontStripIndent: boolean;
}

interface MdProps extends BaseProps {
    /**
     * The pre-configured `MarkdownIt` instance.
     */
    md: MD;
}

interface OptionsProps extends BaseProps {
    /**
     * Options passed to the `MarkdownIt` constructor.
     * 
     * @see https://markdown-it.github.io/markdown-it/#MarkdownIt.new
     */
    options?: Options;

    /**
     * List of plugins to apply to the `MarkdownIt` instance.
     * 
     * @warning Any plugin which overwrites the instance's renderer directly will cause an error.
     */
    plugins?: Plugin[];

    /**
     * The preset name to use.
     * 
     * @default `"default"`
     * @see https://markdown-it.github.io/markdown-it/#MarkdownIt.new
     */
    presetName: 'commonmark' | 'zero' | 'default';
}

interface State {
    md: MD;
}

function isMdProps(props: BaseProps): props is MdProps {
    return !!(props as MdProps).md;
}

export default class ReactifyMarkdown<TProps extends MdProps | OptionsProps> extends PureComponent<TProps, State> {
    constructor(props: TProps) {
        super(props);
        this.state = this.generateState(props);
    }

    componentDidUpdate(nextProps: TProps, nextState: State) {
        if (this.state !== nextState) {
            // state is updating due to props updating
            return;
        }

        if (isMdProps(nextProps)) {
            if (nextProps.md !== this.state.md) {
                this.setState(this.generateState(nextProps));
            }
        } else {
            let props = this.props as unknown as OptionsProps,
                nProps = nextProps as OptionsProps,
                plugins = props.plugins || [],
                nPlugins = nProps.plugins || [],
                pluginsChanged = plugins.length !== nPlugins.length;

            if (!pluginsChanged) {
                for (let i = 0; i < plugins.length; i++) {
                    if (plugins[i] !== nPlugins[i]) {
                        pluginsChanged = true;
                        break;
                    }
                }
            }
            
            // if plugins have changed, we have to recreate the whole markdown instance
            if (pluginsChanged || props.dontStripIndent !== nextProps.dontStripIndent) {
                this.setState(this.generateState(nextProps));
                return;
            }

            // otherwise, modify the md instance before rerendering
            if (JSON.stringify((nextProps as OptionsProps).options) !== JSON.stringify(props.options)) {
                (this.state.md as any).configure(nextProps);
            }

            if (!props.enable && !props.disable && !nextProps.enable && !nextProps.disable) {
                // common case
                return;
            }

            let dis = new Set(props.disable),
                nDis = new Set(nextProps.disable),
                en = new Set(props.enable),
                nEn = new Set(nextProps.enable),
                toEnable = new Set<string>(),
                toDisable = new Set<string>();
            
            for (let val of dis) {
                if (!nDis.has(val)) {
                    toEnable.add(val);
                }
            }

            for (let val of nDis) {
                if (!dis.has(val)) {
                    toDisable.add(val);
                }
            }

            for (let val of en) {
                if (!nEn.has(val)) {
                    toDisable.add(val);
                }
            }

            for (let val of nEn) {
                if (!en.has(val)) {
                    toEnable.add(val);
                }
            }

            this.state.md.enable(Array.from(toEnable));
            this.state.md.disable(Array.from(toDisable));
        }
    }

    private generateState(props: TProps): State {
        if (isMdProps(props)) {
            props.md.use(RenderReactPlugin);
            return {
                md: props.md
            };
        } else {
            let {
                    options,
                    presetName,
                    plugins
                } = props as OptionsProps,
                state: State,
                md = new MD(presetName, options);

            md.use(RenderReactPlugin);
            state = {
                md: md
            };

            const renderer = md.renderer;

            if (plugins) {
                plugins.forEach((p, i) => {
                    md.use(...p);
                    if (md.renderer !== renderer) {
                        if (p.constructor.name !== 'Function') {
                            throw new Error(`Plugin ${p.constructor.name} overwrote the renderer.`);
                        } else {
                            throw new Error(`Plugin at index ${i} overwrote the renderer.`);
                        }
                    }
                });
            }

            return state;
        }
    }

    render() {
        const source = this.props.dontStripIndent ? this.props.children : stripIndent(this.props.children);
        return this.state.md.render(source, this.props.env);
    }

    static defaultProps: Partial<MdProps & OptionsProps> = {
        presetName: 'default',
        env: {},
        dontStripIndent: false
    };
}