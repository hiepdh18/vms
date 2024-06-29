const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        './src/assets',
        {
          "glob": "Dockerfile",
          "input": ".",
          "output": "."
        },
        {
          "glob": ".env.*",
          "input": ".",
          "output": "."
        },
        {
          "glob": "app.config.json",
          "input": ".",
          "output": "."
        }],
      optimization: false,
      outputHashing: 'none',
      deleteOutputPath: false
    }),
  ],
};
