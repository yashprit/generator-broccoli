'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('broccoli:app', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({
        'skip-install': true
      })
      .withPrompt({
        someOption: true
      })
      .on('end', done);
  });

  it('creates all basic files', function() {
    assert.file([
      'package.json',
      '.editorconfig',
      '.jshintrc',
      '.npmignore',
      'Brocfile.js',
      'index.js',
      'fixture',
      'LICENSE',
      'test.js',
      'README.md',
      '.gitattributes',
      '.travis.yml'
    ]);
  });
});
