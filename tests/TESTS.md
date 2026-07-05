# Tests

- `make test` compiles the native shim against a mock `polycall_ffi_run_config`
  and checks argument forwarding and status propagation.
- `package.test.js` checks npm metadata, every relative source index, exported
  paths, and traversal protection.
- `source.test.js` enforces the thin boundary and registered R `.Call` wiring.
- The default npm suite parses the R sources when `Rscript` is installed.
- `npm run test:r` requires R and builds/runs the registered `.Call` smoke test.

The mock replaces only the libpolycall ABI; no core runtime behavior is copied.
