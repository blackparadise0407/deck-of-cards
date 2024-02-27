const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  entry: "./lib/server.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
  },
  plugins: [new NodePolyfillPlugin()],
  resolve: {
    modules: ["node_modules"],
    fallback: {
      fs: require.resolve("fs"),
    },
  },
};
