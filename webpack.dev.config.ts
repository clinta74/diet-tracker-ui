import path from "path";
import webpack, { EnvironmentPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from "eslint-webpack-plugin";

import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import { Configuration as WebpackConfiguration } from "webpack";

type Configuration = WebpackConfiguration & {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  mode: "development",
  output: {
    publicPath: "/",
  },
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      API_URL: 'https://localhost:5001',
      REACT_APP_AUTH0_DOMAIN: 'dev-clinta74.us.auth0.com',
      REACT_APP_AUTH0_CLIENT_ID: 'I1EPbV0JzhQ4sMebkA5XSg0RhYhJBa1k',
      REACT_APP_AUTH0_AUDIENCE: 'https://diet-tracker.pollyspeople.net',
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: 4000,
    open: true,
    hot: true
  },
};

export default config;