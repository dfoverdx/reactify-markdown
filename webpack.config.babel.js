import webpack from 'webpack';
import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';

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
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
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
    ]);
    
    return webpackConfig;
}