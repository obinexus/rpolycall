# Adapter boundary

`rpolycall.c` is the language-neutral native shim. It performs exactly one
call to `polycall_ffi_run_config(config_path, 1)` and returns the status
unchanged.

`rpolycall_r.c` is the R boundary. It validates a length-one character value,
converts it to UTF-8, and returns the status as an R integer. `init.c` registers
the `.Call` entry point and disables dynamic symbol lookup.

Configuration parsing, networking, and runtime ownership stay in libpolycall.
