.rpolycall_default_config <- function() {
  installed <- system.file("rpolycallrc", package = "rpolycall")
  if (nzchar(installed)) installed else "rpolycallrc"
}

#' Run a libpolycall configuration
#'
#' @param config_path A length-one character path. The installed
#'   `rpolycallrc` is used by default.
#' @return The integer libpolycall status, unchanged.
#' @export
polycall_run_config <- function(config_path = .rpolycall_default_config()) {
  if (!is.character(config_path) || length(config_path) != 1L || is.na(config_path)) {
    stop("config_path must be one non-NA character value", call. = FALSE)
  }

  .Call(
    "C_rpolycall_run_config",
    enc2utf8(config_path),
    PACKAGE = "rpolycall"
  )
}

#' Run a libpolycall configuration or stop
#'
#' @inheritParams polycall_run_config
#' @return The status invisibly when it is zero.
#' @export
polycall_run_config_or_stop <- function(config_path = .rpolycall_default_config()) {
  status <- polycall_run_config(config_path)
  if (status != 0L) {
    condition <- structure(
      list(
        message = sprintf("libpolycall failed with status %d", status),
        call = sys.call(),
        status = status
      ),
      class = c("rpolycall_error", "error", "condition")
    )
    stop(condition)
  }

  invisible(status)
}
