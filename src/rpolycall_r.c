#include "rpolycall.h"

#include <R.h>
#include <Rinternals.h>

SEXP C_rpolycall_run_config(SEXP config_path) {
    const char *utf8_path;
    int32_t status;

    if (TYPEOF(config_path) != STRSXP || XLENGTH(config_path) != 1) {
        Rf_error("config_path must be one character value");
    }
    if (STRING_ELT(config_path, 0) == NA_STRING) {
        Rf_error("config_path must not be NA");
    }

    utf8_path = Rf_translateCharUTF8(STRING_ELT(config_path, 0));
    status = rpolycall_run_config(utf8_path);
    return Rf_ScalarInteger((int)status);
}
