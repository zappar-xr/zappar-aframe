require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@zappar/eslint-config-zappar"],
  parserOptions: { tsconfigRootDir: __dirname },
};
