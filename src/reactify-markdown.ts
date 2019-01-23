import { PureComponent } from 'react';
import MD from 'markdown-it';
import stripIndent from 'strip-indent';
import RenderReactPlugin from './react-renderer-plugin';
import { MarkdownItPresetName, ReactifyMarkdownProps as Props } from './types';

interface State {
    md: MD;
}

function isMdProps(props: Props<'md'> | Props<'options'>): props is Props<'md'> {
    return !!props.md;
}

export default class ReactifyMarkdown<
    TProps extends Props<'md'> | Props<'options'>
> extends PureComponent<TProps, State> {
    constructor(props: TProps) {
        super(props);

        // this won't compile in typescript unless the user has changed ReactifyMarkdown.defaultProps
        if (props.md && (
            props.options || props.plugins || props.enable || props.disable || 
            props.presetName && props.presetName !== ReactifyMarkdown.defaultProps.presetName
        )) {
            if (ReactifyMarkdown.defaultProps.md) {
                console.warn(
                    `${ReactifyMarkdown.name}.defaultProps.md is defined, while this instance of ` + 
                    `${ReactifyMarkdown.name} has properties 'options', 'plugins', 'enable', 'disable', and/or ` +
                    `'presetName' defined.  The other properties are ignored.`);
            } else {
                console.warn(`${ReactifyMarkdown.name} has both 'md' and 'options', 'plugins', 'enable', 'disable', ` +
                    `and/or 'presetName' defined.  The other properties are ignored.`);
            }
        }

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
            let props = this.props,
                nProps = nextProps,
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
            if (JSON.stringify(nextProps.options) !== JSON.stringify(props.options)) {
                (this.state.md as any).configure(nextProps);
            }

            if (!props.enable && !props.disable && !nextProps.enable && !nextProps.disable) {
                // common case
                return;
            }

            let enable = new Set(props.enable),
                nextEnable = new Set(nextProps.enable),
                toEnable = new Set<string>(),
                disable = new Set(props.disable),
                nextDisable = new Set(nextProps.disable),
                toDisable = new Set<string>();
            
            for (const val of disable) {
                if (!nextDisable.has(val)) {
                    toEnable.add(val);
                }
            }

            for (const val of nextDisable) {
                if (!disable.has(val)) {
                    toDisable.add(val);
                }
            }

            for (const val of enable) {
                if (!nextEnable.has(val)) {
                    toDisable.add(val);
                }
            }

            for (const val of nextEnable) {
                if (!enable.has(val)) {
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
                } = props as Props<'options'>,
                state: State,
                md = new MD(presetName, options);

            md.use(RenderReactPlugin);
            state = {
                md: md
            };

            const renderer = md.renderer;

            if (plugins) {
                if (!Array.isArray(plugins)) {
                    plugins = [plugins];
                }
                
                plugins.forEach((p, i) => {
                    md.use.call(md, ...p);
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

    static defaultProps: 
            Partial<Props<'options'> | Omit<Props<'md'>, 'presetName'>> & { presetName: MarkdownItPresetName } = {
        presetName: 'default',
        env: {},
        dontStripIndent: false,
    };
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;