#include "rpolycall.h"
#include "polycall_ffi_mock.h"

#include <assert.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    int32_t status;

    polycall_ffi_mock_reset();
    status = rpolycall_run_config("examples/rpolycallrc");
    assert(status == 0);
    assert(polycall_ffi_mock_call_count() == 1);
    assert(polycall_ffi_mock_last_validate() == 1);
    assert(strcmp(polycall_ffi_mock_last_config(), "examples/rpolycallrc") == 0);

    polycall_ffi_mock_return_status(37);
    status = rpolycall_run_config("custom-rpolycallrc");
    assert(status == 37);
    assert(polycall_ffi_mock_call_count() == 2);
    assert(strcmp(polycall_ffi_mock_last_config(), "custom-rpolycallrc") == 0);

    puts("rpolycall native adapter test: PASS");
    return 0;
}
