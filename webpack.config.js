const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const packageJSON = require('./package.json');

// Get all vendor lib's from package.json
// Defining this to split the npm packages js code from application js code.
const VENDOR_LIBS = ( () => {
    if (!packageJSON['dependencies']) {
        return;
    }
    let depArr = [];
    for (const package in packageJSON['dependencies']) {
        depArr.push(package);
    }
    return depArr;
})();

// Extract the css to a .css file.
const extractSass = new ExtractTextPlugin({
    filename: "styles.[chunkhash].css",
    disable: process.env.NODE_ENV === "development"
});

// Basic setup for the config
const config = {
    devtool: "source-map",
    entry: {
        bundle: [
            './src/index.js',
            './src/index.scss'
        ]
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
                test: /\.scss/,
                use: extractSass.extract({
                    use: [
                        {loader: "css-loader"},
                        {loader: "sass-loader"}
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

// Code splitting:
// If package.json contains dep's. Add them to the vendor entry.
// Will create a specific vendor.js file.
if ( VENDOR_LIBS && VENDOR_LIBS.length >= 1 ) {
    config.entry.vendor = VENDOR_LIBS;
}

module.exports = config;