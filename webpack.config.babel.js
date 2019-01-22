import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export default function genConfig(_, options) {
    const NODE_ENV = (options.mode || process.env.NODE_ENV || 'production').trim(),
        isProd = NODE_ENV === 'production',
        isDev = !isProd;
    
    const webpackConfig = {
        entry: {
            index: './src/index.ts',
        },
        
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, isDev ? 'dev-dist' : 'dist'),
            library: 'reactify-markdown',
            libraryTarget: 'commonjs2',
        },

        optimization: {
            minimize: isProd,
            minimizer: [
                new TerserPlugin({
                    include: /\.min\.js$/,
                    sourceMap: true,
                    terserOptions: {
                        compress: {
                            unsafe: true,
                            unused: true
                        },
                        keep_classnames: /^(ReactifyMarkdown|ReactRenderer(Plugin)?)$/,
                        mangle: true,
                        ecma: 6,
                    }
                })
            ]
        },

        devtool: isProd ? 'source-map' : 'eval',

        resolve: {
            extensions: [ '.ts', '.tsx', '.js' ],
            alias: {
                react: path.resolve('./node_modules/react'),
                'markdown-it': path.resolve('./node_modules/markdown-it'),
                'markdown-it/lib/index': path.resolve('./node_modules/markdown-it/lib/index.js'),
                'markdown-it/lib/token': path.resolve('./node_modules/markdown-it/lib/token.js'),
                'markdown-it/lib/common/utils': path.resolve('./node_modules/markdown-it/lib/common/utils'),
            }
        },
        
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules|__tests__/,
                    loader: 'awesome-typescript-loader'
                },
                {
                    enforce: 'pre', 
                    test: /\.js$/, 
                    loader: 'source-map-loader' 
                }
            ]
        },
        
        plugins: [],
    };
    
    function addPlugins(plugins) {
        for (let plugin of plugins) {
            if (plugin) {
                webpackConfig.plugins.push(plugin);
            }
        }
    }
    
    addPlugins([
        isProd && new CleanWebpackPlugin(['dist']),
        new DuplicatePackageCheckerPlugin(),
    ]);
    
    return webpackConfig;
}