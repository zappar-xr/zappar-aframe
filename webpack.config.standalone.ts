import baseConfig from "./webpack.base.config";

const webpack = require("webpack");

baseConfig.externals = {
  aframe: "AFRAME",
  three: "THREE",
};
baseConfig.plugins.push(
  new webpack.DefinePlugin({
    Z_STANDALONE: true,
  })
);
delete baseConfig.devtool;
module.exports = baseConfig;
