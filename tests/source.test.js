'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const shim = read('src/rpolycall.c');
const wrapper = read('src/rpolycall_r.c');
const registration = read('src/init.c');
const rApi = read('R/polycall.R');

assert.match(shim, /polycall_ffi_run_config\s*\(\s*config_path\s*,\s*1\s*\)/);
assert.match(wrapper, /Rf_translateCharUTF8/);
assert.match(wrapper, /rpolycall_run_config\s*\(\s*utf8_path\s*\)/);
assert.match(registration, /R_registerRoutines/);
assert.match(registration, /R_useDynamicSymbols\s*\(\s*dll\s*,\s*FALSE\s*\)/);
assert.match(rApi, /\.Call\s*\([\s\S]*?"C_rpolycall_run_config"/);
assert.match(rApi, /PACKAGE\s*=\s*"rpolycall"/);
assert.match(rApi, /class\s*=\s*c\("rpolycall_error"/);

for (const forbidden of ['fopen(', 'CreateFile', 'json_parse', 'curl_', 'socket(']) {
  assert.ok(!shim.includes(forbidden), `native shim must not contain ${forbidden}`);
}

console.log('rpolycall thin-adapter source test: PASS');
