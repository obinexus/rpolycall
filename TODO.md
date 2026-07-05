# TODO — rpolycall

Status: implemented thin R adapter and npm source distribution.

- [x] Add the generated libpolycall FFI contract and public adapter header.
- [x] Implement exact one-hop native status forwarding.
- [x] Add a registered R `.Call` boundary with UTF-8 path conversion.
- [x] Add R functions, installed default config, example, and mock tests.
- [x] Add public npm metadata and recursive relative-directory indexes.
- [x] Add package/source checks and mandatory prepack verification.
- [ ] Run `npm run test:r` on a host with R and its native toolchain installed.
- [ ] Exercise an installed R package against a real libpolycall 1.5 build.
- [ ] Publish `@obinexusltd/rpolycall` after npm authentication is confirmed.

Keep parser, networking, and runtime logic in libpolycall.
