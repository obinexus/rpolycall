# @obinexusltd/rpolycall

Thin R source binding for libpolycall 1.5. The R API crosses one registered
`.Call` boundary and the native shim delegates directly to
`polycall_ffi_run_config(config_path, 1)`. It contains no configuration parser
or runtime implementation.

## Install

The npm package distributes and indexes the complete source tree:

```bash
npm install @obinexusltd/rpolycall
```

To install it as an R package, make libpolycall available to the linker and run:

```bash
R CMD INSTALL .
```

On PowerShell, linker flags can be supplied before installation:

```powershell
$env:POLYCALL_LIBS = '-LC:/path/to/libpolycall/lib -lpolycall'
R CMD INSTALL .
```

## R API

```r
library(rpolycall)

status <- polycall_run_config("rpolycallrc")
polycall_run_config_or_stop("rpolycallrc")
```

`polycall_run_config()` returns the exact libpolycall integer status.
`polycall_run_config_or_stop()` raises an `rpolycall_error` for nonzero status.
With no argument, both functions use the package-installed `rpolycallrc`.

## Source index

The CommonJS entry point recursively indexes `R`, `inst`, `src`, `include`,
`generated`, `dist`, `examples`, `tests`, and `scripts` using package-relative
paths. Consumers can inspect them without assuming an installation location:

```js
const rpolycall = require('@obinexusltd/rpolycall');

console.log(rpolycall.directories.r.relativeFiles);
console.log(rpolycall.resolve('examples', 'run.R'));
```

## Verification and publishing

```bash
npm test
npm run test:r
npm pack --dry-run
npm publish --access public
```

`npm test` always runs the native mock and npm/source checks. It also parses R
sources when `Rscript` is available. `npm run test:r` strictly requires R and
runs the registered native `.Call` smoke test.

Author: Nnamdi Michael Okpala <okpalan@protonmail.com>

License: MIT
