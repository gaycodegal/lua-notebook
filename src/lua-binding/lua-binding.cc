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

enum LuaStatus {
  LOAD_FAILURE,
  CALL_FAILURE,
  SUCCESS
};


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

LuaStatus loadLuaString(lua_State *L, const char *file, int nresults) {
  if (file == NULL) {
    return LOAD_FAILURE;
  }
  if (luaL_loadstring(L, file)) {
    //printf("failed to load with error:%s\n", lua_tostring(L, -1));
    return LOAD_FAILURE;
  }
  if (lua_pcall(L, 0, nresults, 0)) {
    /* PRIMING RUN. FORGET THIS AND YOU'RE TOAST */
    //printf("failed to call with error:%s\n", lua_tostring(L, -1));
    return CALL_FAILURE;
  }
  return SUCCESS;
}


/**
	 it turns out that the lua repl
	 actually tries both "return ..." as well
	 as the default string itself "..." for execution
	 and picks whichever actually succeeds
 */
bool loadLuaStringReturnPrefixed(lua_State *L, const std::string& lua_src, int nresults) {
	if (!lua_src.starts_with("return ")) {
		lua_pushliteral(L, "error string does not begin with return");
		return false;
	}

	LuaStatus evalStatus = loadLuaString(L, lua_src.c_str(), 1);
	if (evalStatus != LOAD_FAILURE) {
		return evalStatus == SUCCESS;
	}
	lua_settop(L, 0);
	size_t size = lua_src.size();

	// "return " is length 7
	const char * subStringDanger = lua_src.c_str() + 7;

	return loadLuaString(L, subStringDanger, 1) == SUCCESS;
}

#define LUA_STACK_TOP -1

#include <string>
#include <vector>
std::string exec_lua(std::string lua_src) {
	lua_State *L;
	L = luaL_newstate();
	//luaL_openlibs(L);

	loadLuaStringReturnPrefixed(L, lua_src, 1);
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

