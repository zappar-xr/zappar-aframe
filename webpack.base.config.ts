import "webpack-dev-server";
import * as webpack from "webpack";

const path = require("path");

type extend = {
  devServer: any;
};

const config: webpack.Configuration & extend = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "umd"),
    filename: "zappar-aframe.js",
    library: "ZapparAFrame",
    libraryTarget: "umd",
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".wasm"],
  },
  plugins: [],
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            attributes: {
              list: [
                {
                  tag: "img",
                  attribute: "src",
                  type: "src",
                },
                {
                  tag: "a-asset-item",
                  attribute: "src",
                  type: "src",
                },
              ],
            },
          },
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: [/node_modules/, /\.d\.ts$/],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: /zcv\.wasm$/,
        type: "javascript/auto",
        loader: "file-loader",
      },
      {
        test: /\.(zpt|png|gif|glb|gltf|jpe?g|ogg|mp3|obj|fbx|wav|ttf|fnf|woff|stl|mp4|hdr|webm)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets",
              name: "[sha256:hash:base64:16].[ext]",
            },
          },
        ],
      },
    ],
  },
};

export default config;
