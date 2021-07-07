/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
import baseConfig from "./webpack.base.config";
import "webpack-dev-server";

const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { readdirSync, readFile, writeFile } = require("fs");
const chokidar = require("chokidar");
const WebpackCdnPlugin = require("webpack-cdn-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const baseConfig = require("./webpack.base.config");
const getStandaloneVersions = require("./standalone-versions");

export default async (env) => {
  baseConfig.entry = {
    manual: "./tests/manual/common.ts",
    module: "./tests/jest/module/common.ts",
    standalone: "./tests/jest/generated-standalone/common.js",
  };

  baseConfig.output = {
    filename: "js/[name].js",
    path: `${__dirname}test-dist`,
    // publicPath: "./",
  };

  const getFilesInDirectory = (source: string): string[] | undefined =>
    readdirSync(source, { withFileTypes: true })
      .filter((dirent) => !dirent.isDirectory())
      .map((dirent) => dirent.name);

  // Does not account for cases or "actual" extensions
  const getFilesOfTypeInDirectory = (source: string, type: string): string[] | undefined =>
    getFilesInDirectory(source).filter((file) => file.includes(type));

  type PluginOptions = {
    testsType: "manual" | "jest/module" | "jest/standalone";
    testsPath: "./tests/manual" | "./tests/jest/module" | "./tests/jest/generated-standalone";
    chunk: "manual" | "module" | "standalone";
    modules: {
      [key: string]: {
        name: string;
        var: string;
        path: string;
        prodUrl: string;
      }[];
    };
  };
  const getPluginsFromPath = (opts: PluginOptions) => {
    const { testsType, testsPath, chunk, modules } = opts;
    const manualHTML = getFilesOfTypeInDirectory(testsPath, ".html");
    const plugins = [];

    const pathToName = (path: string) => {
      const templateParts = path.split("/");
      return templateParts[templateParts.length - 1].split(".")[0]; // drop the .html... this is messy
    };

    if (modules) {
      for (const key in modules) {
        manualHTML.forEach((templateFileName) => {
          const htmlTemplatePath = `${testsPath}/${templateFileName}`;

          const templateName = pathToName(templateFileName);
          plugins.push(
            new HtmlWebpackPlugin({
              inject: "head",
              template: htmlTemplatePath,
              filename: `./pages/${testsType}/${templateName}-${key}.html`,
              chunks: [chunk],
              scriptLoading: "blocking", // defaults to defer,
              cdnModule: key,
            })
          );
        });
      }
    } else {
      manualHTML.forEach((templateFileName) => {
        const htmlTemplatePath = `${testsPath}/${templateFileName}`;

        const templateName = pathToName(templateFileName);
        plugins.push(
          new HtmlWebpackPlugin({
            inject: "head",
            template: htmlTemplatePath,
            filename: `./pages/${testsType}/${templateName}.html`,
            chunks: [chunk],
            scriptLoading: "blocking", // defaults to defer,
            cdnModule: false,
          })
        );
      });
    }

    return plugins;
  };

  const generateStandalone = () => {
    // loop through all .ts files converting them to .js
    for (const file of getFilesOfTypeInDirectory("./tests/jest/module/", ".ts")) {
      const moduleFilePath = `./tests/jest/module/${file}`;
      const standaloneFilePath = `./tests/jest/generated-standalone/${file.replace(".ts", ".js")}`;
      readFile(moduleFilePath, "utf8", (err, data) => {
        if (err) {
          return console.log(err);
        }
        const result = data.replace(/<!-- build-remove-start -->([\s\S]*?)<!-- build-remove-end -->/g, "");

        writeFile(standaloneFilePath, result, "utf8", (err) => {
          if (err) return console.log(err);
          console.log(`Standalone site generated: ${standaloneFilePath}`);
        });
      });
    }

    for (const file of getFilesOfTypeInDirectory("./tests/jest/module/", ".html")) {
      const htmlFilePath = `./tests/jest/module/${file}`;
      const standaloneHTMLFilePath = `./tests/jest/generated-standalone/${file}`;

      readFile(htmlFilePath, "utf8", (err, data) => {
        if (err) {
          return console.log(err);
        }
        // Could inject here.
        writeFile(standaloneHTMLFilePath, data, "utf8", (err) => {
          if (err) return console.log(err);
          console.log(`Standalone site generated: ${standaloneHTMLFilePath}`);
        });
      });
    }
  };

  let CDN_URL = "../../../standalone/zappar-aframe.js";
  if (env.POST_TEST) {
    const CDN_RESPONSE = await fetch("https://libs.zappar.com/zappar-aframe/latest.json");
    const CDN_DATA = await CDN_RESPONSE.json();
    CDN_URL = CDN_DATA.cdn;
  }

  const modules = {};
  for (const version of getStandaloneVersions()) {
    modules[version] = [
      { name: "AFRAME", var: "AFRAME", path: "aframe.min.js", prodUrl: `https://cdnjs.cloudflare.com/ajax/libs/aframe/${version}/aframe.min.js` },
      { name: "AFRAME", var: "AFRAME", path: "aframe.min.js", prodUrl: CDN_URL }, //* Hacky way to load in our local script.
    ];
  }

  generateStandalone();

  const manualTestPlugins = getPluginsFromPath({
    testsType: "manual",
    testsPath: "./tests/manual",
    chunk: "manual",
    modules: undefined,
  });

  const jestModulePlugins = getPluginsFromPath({
    testsType: "jest/module",
    testsPath: "./tests/jest/module",
    chunk: "module",
    modules: undefined,
  });

  const standalonePlugins = getPluginsFromPath({
    testsType: "jest/standalone",
    testsPath: "./tests/jest/generated-standalone",
    chunk: "standalone",
    modules: modules as any,
  });

  baseConfig.plugins = jestModulePlugins.concat(manualTestPlugins, standalonePlugins);

  baseConfig.plugins.push(
    new CopyPlugin({
      patterns: [{ from: "./umd", to: "./standalone/" }],
    })
  );
  const injectPlugin = new WebpackCdnPlugin({
    modules, // standalone
  });
  baseConfig.plugins.push(
    new ESLintPlugin({
      fix: true,
      extensions: ["ts", "tsx"],
      exclude: ["node_modules", "tests"],
    })
  );

  baseConfig.plugins.push(injectPlugin);

  (baseConfig as any).devServer = {
    contentBase: "./test-dist",
    https: true,
    host: "0.0.0.0",
    open: false,
    hot: true,
    port: 8081,
    // Hot reload html
    before(app, server) {
      chokidar.watch(["./tests/**/*.html"]).on("all", () => {
        server.sockWrite(server.sockets, "content-changed");
      });
    },
  };

  baseConfig.output.path = path.resolve(__dirname, "test-dist");
  return baseConfig;
};
