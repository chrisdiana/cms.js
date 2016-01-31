#!/usr/bin/env node

process.bin = process.title = 'CMS.js';

var program = require('commander');
var pkg = require('../package.json');

var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

program
  .version(pkg.version)
  .usage('<command> [<args>]');

program
  .command('init')
  .description('init app')
  .action(function() {
    fse.copy(path.join(__dirname, '../boilerplate'), '.', function() {
      var b = browserify();
      b.add(path.join(__dirname, '/cms.js'));
      b.bundle().pipe(fs.createWriteStream('./js/cms.js'));
    });
  });

program.on('*', function() {
  console.log('Unknown Command: ' + program.args.join(' '));
  program.help();
});

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
