args <- commandArgs(trailingOnly = TRUE)
config_path <- if (length(args)) args[[1L]] else "rpolycallrc"

status <- rpolycall::polycall_run_config(config_path)
if (status != 0L) {
  quit(status = status)
}

cat("libpolycall completed successfully\n")
