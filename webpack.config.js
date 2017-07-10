const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    entry: {
        bundle: path.join(__dirname, './src/index.js'),
    },
    output: {
        path: path.join(__dirname, './build/'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'history.html',
            template: path.join(__dirname, './src/history.html'),
            minify: false,
        }),
        new CopyWebpackPlugin([{ from: 'src/manifest.json'}])
    ],
};
