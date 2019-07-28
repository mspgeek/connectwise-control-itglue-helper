module.exports = {
  cacheDirectory: '.babel',
  'presets': [[
    '@babel/preset-env', {
      'targets': 'ie >= 8',
      // useBuiltIns: 'entry',
      // // 'modules': false,
      // 'corejs': 3,
    },
  ]],
  'plugins': [
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-transform-property-literals',
    '@babel/plugin-transform-member-expression-literals',
    '@babel/plugin-transform-reserved-words',
    // [
    //   '@babel/plugin-transform-runtime', {
    //     'absoluteRuntime': true,
    //     // 'corejs': 3,
    //     'helpers': true,
    //     // 'regenerator': true,
    //     'useESModules': false,
    //   },
    // ],
  ],
};
