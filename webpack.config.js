
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "/src/main.js"
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                phaser: {
                    test: /[\\/]node_modules[\\/]phaser[\\/]/,
                    name: "phaser",
                    chunks: "all",
                },
            }
        }
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]-[contenthash].bundle.js",
        assetModuleFilename: "asset-packs/[name]-[hash][ext][query]",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.json/,
                type: "asset/resource",
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        historyApiFallback: true,
        allowedHosts: 'all',
        static: {
            directory: path.resolve(__dirname, "./dist"),
        },
        open: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"),
            minify: false
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: 'assets',
                },
                {
                    from: path.resolve(__dirname, 'game.html'),
                }
            ],
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
};
