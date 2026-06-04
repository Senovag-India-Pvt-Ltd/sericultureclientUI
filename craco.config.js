// CRA 5 / webpack 5 override.
// Some ESM dependencies (e.g. canvg, pulled in transitively by jspdf) ship with
// `"type": "module"`, which makes webpack enforce fully-specified imports. Those
// packages import helpers (e.g. @babel/runtime) without file extensions, breaking
// the build. Disabling `fullySpecified` for .js/.mjs modules resolves this.
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });
      return webpackConfig;
    }, 
  },
};
