const path = require("path");

var SRC_DIR = path.resolve(__dirname, "./src");
var DIST_DIR = path.resolve(__dirname, "./www");
var DEV_DIR = path.resolve(__dirname, "./.temp");

 var buildConfig = function(env) {
    var isProd = env === "prod";
    return {
        context: __dirname,
        entry: {
            index: SRC_DIR + "/app.ts",
            indexWorker: SRC_DIR + "/appWorker.ts",
            processWorker: SRC_DIR + "/processWorker.ts"
        },
        output: {
            path: (isProd ? DIST_DIR : DEV_DIR) + "/scripts/",
            publicPath: "www/scripts/",
            filename: "[name].js",
        },
        devtool: isProd ? "none" : "source-map",
        devServer: {
            openPage: '/www'
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }]
        },
        mode: isProd ? "production" : "development"
    };
 }

module.exports = buildConfig;