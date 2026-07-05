args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 1L) {
  stop("usage: Rscript tests/r.test.R /path/to/rpolycall-library")
}

dyn.load(normalizePath(args[[1L]], mustWork = TRUE))
source(file.path("R", "polycall.R"), local = .GlobalEnv)

stopifnot(polycall_run_config("explicit-rpolycallrc") == 0L)
stopifnot(polycall_run_config() == 0L)
stopifnot(polycall_run_config("__status_37__") == 37L)

caught <- tryCatch(
  {
    polycall_run_config_or_stop("__status_37__")
    NULL
  },
  rpolycall_error = identity
)
stopifnot(inherits(caught, "rpolycall_error"))
stopifnot(caught$status == 37L)

cat("rpolycall registered .Call smoke test: PASS\n")
