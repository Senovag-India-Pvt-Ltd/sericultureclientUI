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

      // The production bundle is large. Terser's default parallel mode runs
      // minification in worker threads and transfers the bundle via structured
      // clone, which OOMs ("Data cannot be cloned, out of memory"). Running
      // Terser in the main process uses the enlarged --max-old-space-size heap
      // and avoids the cross-thread copy.
      const minimizer = (webpackConfig.optimization || {}).minimizer || [];
      minimizer.forEach((plugin) => {
        if (plugin && plugin.constructor && plugin.constructor.name === 'TerserPlugin') {
          plugin.options.parallel = false;
        }
      });

      return webpackConfig;
    }, 
  },
};
