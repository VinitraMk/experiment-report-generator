const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        eog: [
            './src/index.js',
            "./src/scss/custom.scss"
        ]
    },
    devtool: 'source-map',
    output: {
        path: '../../reports',
        filename: 'bundle.js',
        publicPath: '../../'
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './reports',
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(tsx|ts)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '/images',
                            publicPath: '/build/images'
                        }
                    }
                ]
            },
            {
                test: /\.(scss|css)$/, // styles files,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.jsx', '.ts', '.js', '.tsx'],
        fallback: {
            crypto: false,
            path: false,
            os: false,
            net: false,
            stream: false,
            tls: false,
            __dirname: false,
            http: require.resolve('stream-http'),
            buffer: false,
            url: false,
            fs: false
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new NodePolyfillPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: './package.json', to: './data' }
            ]
        })
    ],
    target: "web",
}