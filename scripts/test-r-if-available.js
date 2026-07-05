'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const required = process.argv.includes('--required');
const probe = spawnSync('Rscript', ['--version'], { stdio: 'ignore' });

if (probe.error || probe.status !== 0) {
  if (required) {
    console.error('Rscript is required for this command but was not found on PATH');
    process.exit(1);
  }
  console.log('Rscript not found; skipping R syntax and .Call smoke tests');
  process.exit(0);
}

const syntax = spawnSync(
  'Rscript',
  ['-e', 'parse(file="R/polycall.R"); parse(file="tests/r.test.R")'],
  { cwd: root, stdio: 'inherit' }
);
if (syntax.error || syntax.status !== 0) {
  process.exit(syntax.status || 1);
}

if (!required) {
  console.log('rpolycall R syntax test: PASS (native .Call smoke test is explicit)');
  process.exit(0);
}

const rProbe = spawnSync('R', ['--version'], { stdio: 'ignore' });
if (rProbe.error || rProbe.status !== 0) {
  console.error('R is required to build the registered native test library');
  process.exit(1);
}

const buildDirectory = path.join(root, 'build', 'r-smoke');
fs.mkdirSync(buildDirectory, { recursive: true });
const extension = process.platform === 'win32' ? '.dll' : '.so';
const libraryPath = path.join(buildDirectory, `rpolycall${extension}`);
const normalize = (value) => value.split(path.sep).join('/');
const sources = [
  path.join(root, 'src', 'rpolycall.c'),
  path.join(root, 'src', 'rpolycall_r.c'),
  path.join(root, 'src', 'init.c'),
  path.join(root, 'tests', 'polycall_ffi_mock.c')
];

const compile = spawnSync(
  'R',
  ['CMD', 'SHLIB', '-o', libraryPath, ...sources],
  {
    cwd: buildDirectory,
    env: {
      ...process.env,
      PKG_CPPFLAGS: `-I${normalize(path.join(root, 'include'))} -I${normalize(path.join(root, 'generated'))}`
    },
    stdio: 'inherit'
  }
);
if (compile.error || compile.status !== 0) {
  process.exit(compile.status || 1);
}

const test = spawnSync('Rscript', [path.join('tests', 'r.test.R'), libraryPath], {
  cwd: root,
  stdio: 'inherit'
});
if (test.error || test.status !== 0) {
  process.exit(test.status || 1);
}
