module.exports = {
  cacheDirectory: '.babel',
  'presets': [[
    '@babel/preset-env', {
      'targets': 'ie >= 11',
      useBuiltIns: 'entry',
      'corejs': 3,
    },
  ], '@babel/preset-react'],
  'plugins': [[
    '@babel/plugin-transform-runtime', {
      'absoluteRuntime': true,
      'corejs': 3,
      'helpers': true,
      'regenerator': true,
      'useESModules': false,
    },
  ],
  ],
};
