import webpack from 'webpack';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';

export default function genConfig(_, options) {
    const NODE_ENV = (options.mode || process.env.NODE_ENV || 'production').trim(),
        isProd = NODE_ENV === 'production',
        isDev = !isProd;
    
    const webpackConfig = {
        entry: {
            index: './src/index.ts'
        },
        
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, isDev ? 'dev-dist' : 'dist'),
            library: 'reactify-markdown',
            libraryTarget: 'commonjs2',
        },

        optimization: {
            minimize: isProd,
        },

        devtool: "source-map",

        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.json' ],
            alias: {
                react: path.resolve('./node_modules/react'),
                'markdown-it': path.resolve('./node_modules/markdown-it')
            }
        },
        
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules|__tests__/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules|__tests__/,
                    loader: 'ts-loader'
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