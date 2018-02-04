const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Vendor JS code splitting.
// Specify the names of the vendor packages in the array below. 
const VENDOR_LIBS = [
    'babel-polyfill',
];

// Extract the css to a .css file and add a hash to the filename for cache busting.
const extractSass = new ExtractTextPlugin({
    filename: "styles.[chunkhash].css",
    disable: process.env.NODE_ENV === "development"
});

// Webpack config
const config = {
    devtool: "source-map",
    entry: {
        bundle: './src/index.js',
        vendor: VENDOR_LIBS
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[chunkhash].js',
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/,
            },
            {
                test: /\.(css|scss)$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options : {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options : {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            }
        ]
    },
    plugins: [
        extractSass,
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        })
    ]
};

module.exports = config;
