#include <R.h>
#include <R_ext/Rdynload.h>
#include <R_ext/Visibility.h>
#include <Rinternals.h>

extern SEXP C_rpolycall_run_config(SEXP config_path);

static const R_CallMethodDef call_methods[] = {
    {"C_rpolycall_run_config", (DL_FUNC)&C_rpolycall_run_config, 1},
    {NULL, NULL, 0}
};

void attribute_visible R_init_rpolycall(DllInfo *dll) {
    R_registerRoutines(dll, NULL, call_methods, NULL, NULL);
    R_useDynamicSymbols(dll, FALSE);
}
