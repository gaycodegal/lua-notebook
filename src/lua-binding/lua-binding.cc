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

int loadLuaString(lua_State *L, const char *file, int nresults) {
  if (file == NULL) {
    return 0;
  }
  if (luaL_loadstring(L, file)) {
    printf("failed to load with error:%s\n", lua_tostring(L, -1));
    delete[] file;
    return 0;
  }
  if (lua_pcall(L, 0, nresults, 0)) {
    /* PRIMING RUN. FORGET THIS AND YOU'RE TOAST */
    printf("failed to call with error:%s\n", lua_tostring(L, -1));
    return 0;
  }
  return 1;
}

#define LUA_STACK_TOP -1

#include <string>
#include <vector>
std::string exec_lua(std::string lua_src) {
	lua_State *L;
	L = luaL_newstate();
	//luaL_openlibs(L);

	loadLuaString(L, lua_src.c_str(), 1);
	size_t resultSize = 0;
	const char * result = lua_tolstring(L, LUA_STACK_TOP, &resultSize);
	
	std::string resultCopy(result, resultSize);
  lua_close(L);
	return resultCopy;
}

EMSCRIPTEN_BINDINGS(my_module) {
  //emscripten::register_vector<std::string>("StringList");

  emscripten::function("exec_lua", &exec_lua);
}

