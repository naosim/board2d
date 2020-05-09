module.exports = {
  out: './docs/typedoc',
  name: 'board2d',
  // readme: 'none',
  target: 'ES6',
  includes: './',
  exclude: './node_modules/**',
  mode: 'file',
  //excludeExternals: true,
  //excludeNotExported: true,
  excludePrivate: true,
  includeDeclarations: true,
  theme: 'minimal'
};