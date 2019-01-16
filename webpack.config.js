const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

const APP_PATH = path.resolve(__dirname, 'src');

module.exports = {
    context: path.join(__dirname, "src"),
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },
    entry: APP_PATH,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                loader: "awesome-typescript-loader",
                options: {
                    useBabel: true
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader",
                options: {
                    name: "assets/img/[name].[ext]?[hash]"
                }
            }
        ]
    },
    // For development https://webpack.js.org/configuration/devtool/#for-development
    devtool: "inline-source-map",
    devServer: {
        port: 8080,
        noInfo: true
    },
    plugins: [
        //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: "index.html", //Name of file in ./dist/
            template: "index.html", //Name of template in ./src
            hash: true
        })
    ]
}
