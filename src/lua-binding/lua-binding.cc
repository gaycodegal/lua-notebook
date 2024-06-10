extern "C" {
#include "lua-binding.h"
};

extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
};


#include <emscripten.h>
#include <emscripten/bind.h>


int eprintf(const char *format, ...) {
  va_list args;
  va_start(args, format);
  size_t size = vsnprintf(NULL, 0, format, args);
  va_end(args);
  char *output = (char *)malloc(size + 1);
  vsprintf(output, format, args);
  EM_ASM({ print(UTF8ToString($0)); }, output);

  free(output);

  return size;
}



#include <string>
#include <vector>
int exec_lua(std::string lua_src) {
	lua_State *L;

	return 0;
}

EMSCRIPTEN_BINDINGS(my_module) {
  //emscripten::register_vector<std::string>("StringList");

  emscripten::function("exec_lua", &exec_lua);
}

