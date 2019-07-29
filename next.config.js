const withLess = require('@zeit/next-less');
const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

dotenvLoad();
const withNextEnv = nextEnv();

module.exports = withNextEnv(
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        });
      }
      config.plugins.push(
        new FilterWarningsPlugin({
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        }),
      );
      config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
      return config;
    },
  }),
);
