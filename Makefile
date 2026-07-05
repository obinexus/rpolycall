CC ?= gcc
AR ?= ar

CPPFLAGS ?=
CPPFLAGS += -Iinclude -Igenerated
CFLAGS ?= -O2
CFLAGS += -std=c11 -Wall -Wextra -Wpedantic

BUILD_DIR := build
LIB_DIR := lib
ADAPTER_OBJ := $(BUILD_DIR)/rpolycall.o
STATIC_LIB := $(LIB_DIR)/librpolycall.a
TEST_BIN := $(BUILD_DIR)/rpolycall_adapter_test

ifeq ($(OS),Windows_NT)
EXE_EXT := .exe
endif

TEST_BIN := $(TEST_BIN)$(EXE_EXT)

.DEFAULT_GOAL := all

.PHONY: all
all: $(STATIC_LIB)

$(BUILD_DIR) $(LIB_DIR):
ifeq ($(OS),Windows_NT)
	@if not exist "$@" mkdir "$@"
else
	@mkdir -p $@
endif

$(ADAPTER_OBJ): src/rpolycall.c include/rpolycall.h generated/polycall/polycall_ffi.h | $(BUILD_DIR)
	$(CC) $(CPPFLAGS) $(CFLAGS) -MMD -MP -c $< -o $@

$(STATIC_LIB): $(ADAPTER_OBJ) | $(LIB_DIR)
	$(AR) rcs $@ $^

$(TEST_BIN): src/rpolycall.c tests/polycall_ffi_mock.c tests/rpolycall_adapter_test.c | $(BUILD_DIR)
	$(CC) $(CPPFLAGS) -Itests $(CFLAGS) $^ -o $@

.PHONY: test
test: $(TEST_BIN)
	$(TEST_BIN)

.PHONY: clean
clean:
ifeq ($(OS),Windows_NT)
	@if exist "$(BUILD_DIR)" rmdir /s /q "$(BUILD_DIR)"
	@if exist "$(LIB_DIR)" rmdir /s /q "$(LIB_DIR)"
else
	rm -rf $(BUILD_DIR) $(LIB_DIR)
endif

-include $(ADAPTER_OBJ:.o=.d)
