'use strict';

const fs = require('node:fs');
const path = require('node:path');

const relativeDirectories = Object.freeze({
  r: 'R',
  inst: 'inst',
  src: 'src',
  include: 'include',
  generated: 'generated',
  dist: 'dist',
  examples: 'examples',
  tests: 'tests',
  scripts: 'scripts'
});

function walkFiles(root, current = root) {
  return fs.readdirSync(current, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const absolutePath = path.join(current, entry.name);
      return entry.isDirectory() ? walkFiles(root, absolutePath) : [absolutePath];
    });
}

function indexDirectory(relativePath) {
  const root = path.join(__dirname, relativePath);
  const files = walkFiles(root);
  return Object.freeze({
    relative: relativePath,
    root,
    files: Object.freeze(files),
    relativeFiles: Object.freeze(
      files.map((file) => path.relative(root, file).split(path.sep).join('/'))
    )
  });
}

const directories = Object.freeze(
  Object.fromEntries(
    Object.entries(relativeDirectories).map(([name, relativePath]) => [
      name,
      indexDirectory(relativePath)
    ])
  )
);

function resolve(directoryName, ...segments) {
  const directory = directories[directoryName];
  if (!directory) {
    throw new RangeError(`unknown rpolycall directory: ${directoryName}`);
  }

  const resolved = path.resolve(directory.root, ...segments);
  const prefix = `${directory.root}${path.sep}`;
  if (resolved !== directory.root && !resolved.startsWith(prefix)) {
    throw new RangeError(`path escapes rpolycall ${directoryName} directory`);
  }
  return resolved;
}

module.exports = Object.freeze({
  packageName: '@obinexusltd/rpolycall',
  projectRoot: __dirname,
  directories,
  resolve,
  rApi: path.join(__dirname, 'R', 'polycall.R'),
  installedConfig: path.join(__dirname, 'inst', 'rpolycallrc'),
  nativeSource: path.join(__dirname, 'src', 'rpolycall.c'),
  rWrapperSource: path.join(__dirname, 'src', 'rpolycall_r.c'),
  registrationSource: path.join(__dirname, 'src', 'init.c'),
  nativeHeader: path.join(__dirname, 'include', 'rpolycall.h'),
  ffiHeader: path.join(__dirname, 'generated', 'polycall', 'polycall_ffi.h'),
  description: path.join(__dirname, 'DESCRIPTION'),
  namespace: path.join(__dirname, 'NAMESPACE'),
  config: path.join(__dirname, 'rpolycallrc'),
  manifest: path.join(__dirname, 'polycall-binding.json'),
  makefile: path.join(__dirname, 'Makefile')
});
