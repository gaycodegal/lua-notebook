#define printf eprintf

#ifndef LUA_BINDING__LUA_BINDING_LIB
#define LUA_BINDING__LUA_BINDING_LIB
#include <stdarg.h>
#include <stdio.h>

#ifdef __EMSCRIPTEN__
#include <stdlib.h>
#endif

int eprintf(const char *format, ...);
#endif
