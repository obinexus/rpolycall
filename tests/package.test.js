'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const api = require('..');
const pkg = require('../package.json');

assert.equal(pkg.name, '@obinexusltd/rpolycall');
assert.equal(pkg.version, '1.0.0');
assert.equal(pkg.license, 'MIT');
assert.equal(pkg.author, 'Nnamdi Michael Okpala <okpalan@protonmail.com>');
assert.equal(pkg.publishConfig.access, 'public');
assert.equal(api.packageName, pkg.name);

const directoryKeys = {
  r: 'r', inst: 'inst', src: 'src', include: 'include',
  generated: 'generated', dist: 'dist', examples: 'example',
  tests: 'test', scripts: 'scripts'
};

for (const [apiKey, packageKey] of Object.entries(directoryKeys)) {
  const directory = api.directories[apiKey];
  assert.equal(directory.relative, pkg.directories[packageKey]);
  assert.ok(path.isAbsolute(directory.root));
  assert.ok(directory.files.length > 0, `${apiKey} must contain published files`);
  assert.equal(directory.files.length, directory.relativeFiles.length);
  directory.files.forEach((file) => assert.ok(fs.statSync(file).isFile()));
}

const expectedFiles = {
  r: ['polycall.R'],
  inst: ['rpolycallrc'],
  src: ['init.c', 'Makevars', 'Makevars.win', 'rpolycall.c', 'rpolycall_r.c'],
  include: ['rpolycall.h'],
  generated: ['polycall/polycall_ffi.h'],
  examples: ['run.R'],
  tests: ['r.test.R', 'rpolycall_adapter_test.c'],
  scripts: ['test-r-if-available.js']
};

for (const [key, files] of Object.entries(expectedFiles)) {
  files.forEach((file) => assert.ok(api.directories[key].relativeFiles.includes(file)));
}

for (const file of [api.rApi, api.installedConfig, api.nativeSource,
  api.rWrapperSource, api.registrationSource, api.nativeHeader, api.ffiHeader,
  api.description, api.namespace, api.config, api.manifest, api.makefile]) {
  assert.ok(fs.statSync(file).isFile(), `${file} must exist`);
}

assert.throws(() => api.resolve('src', '..', 'package.json'), RangeError);
assert.throws(() => api.resolve('unknown'), RangeError);

console.log('rpolycall npm package and relative-directory index test: PASS');
