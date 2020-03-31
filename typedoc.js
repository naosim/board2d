module.exports = {
  out: './docs',
  name: 'reversi',
  // readme: 'none',
  target: 'ES6',
  includes: './',
  exclude: './node_modules/typescript/**',
  mode: 'modules',
  //excludeExternals: true,
  //excludeNotExported: true,
  excludePrivate: true,
  includeDeclarations: true
};