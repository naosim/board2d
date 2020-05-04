// ファイル内にある##version##をバージョン番号に置換する
var version = require('version');
var replaceInFile = require('replace-in-file');
version.fetch(function(error, version) {
  if (error) {
    console.error(error);
  } else {
    const options = {
      files: ['dist/index.d.ts', 'dist/index.js', 'docs/modules/*.html'],
      from: /##version##/g,
      to: version,
    };
    replaceInFile.sync(options);
  };
});