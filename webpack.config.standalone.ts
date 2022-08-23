import baseConfig from "./webpack.base.config";

const webpack = require("webpack");

baseConfig.externals = {
  aframe: "AFRAME",
  three: "THREE",
};

baseConfig.entry = "./src/index-standalone.ts";

delete baseConfig.devtool;
module.exports = baseConfig;
