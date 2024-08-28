extern "C" {
#include "lua-binding.h"
};

extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
};
#define LUA_STACK_TOP -1

#include <string>
#include <vector>


#include <emscripten.h>
#include <emscripten/bind.h>

enum LuaStatus {
  LOAD_FAILURE,
  CALL_FAILURE,
  SUCCESS
};

const char * output_id = NULL;

int error_print(const char *format, ...) {
  va_list args;
  va_start(args, format);
  size_t size = vsnprintf(NULL, 0, format, args);
  va_end(args);
  char *output = (char *)malloc(size + 1);
  vsprintf(output, format, args);
  EM_ASM({ error_print_id(UTF8ToString($0), UTF8ToString($1)); }, output_id, output);

  free(output);

  return size;
}

int markdown_print_id(const char *format, ...) {
  va_list args;
  va_start(args, format);
  size_t size = vsnprintf(NULL, 0, format, args);
  va_end(args);
  char *output = (char *)malloc(size + 1);
  vsprintf(output, format, args);
  EM_ASM({ markdown_print_id(UTF8ToString($0), UTF8ToString($1)); }, output_id, output);

  free(output);

  return size;
}

int eprintf(const char *format, ...) {
  va_list args;
  va_start(args, format);
  size_t size = vsnprintf(NULL, 0, format, args);
  va_end(args);
  char *output = (char *)malloc(size + 1);
  vsprintf(output, format, args);
  EM_ASM({ print_id(UTF8ToString($0), UTF8ToString($1)); }, output_id, output);

  free(output);

  return size;
}

int l_markdown_print(lua_State* L)
{
	size_t resultSize;
	const char * result = luaL_tolstring(L, 1, &resultSize);
	if (result == NULL) {
		return 0;
	}
	markdown_print_id("%s", result);

  return 0;
}

int l_require(lua_State* L)
{
	size_t resultSize;
	const char * resultRaw = luaL_tolstring(L, 1, &resultSize);
	if (resultRaw == NULL) {
		return 0;
	}
	// enforce a limit on require path length
	if (resultSize > 100) {
		return 0;
	}
	std::string result(resultRaw, resultSize);

	if (result == "table") {
		luaopen_table(L);
		return 0;
	} else if (result == "math") {
		luaopen_math(L);
		return 0;
	} else if (result == "string") {
		luaopen_string(L);
		return 0;
	} else if (result == "utf8") {
		luaopen_utf8(L);
		return 0;
	} else if (result == "debug") {
		luaopen_debug(L);
		return 0;
	} else if (result == "os") {
		luaopen_os(L);
		return 0;
	}

	// not found, attempt load from js

  char * loadedChunk = (char*)EM_ASM_PTR({
			return stringToNewUTF8(js_lua_require(UTF8ToString($0)));
		}, resultRaw);

	if (loadedChunk == NULL) {
		return 0;
	}

	lua_getglobal(L, "load");
	lua_pushstring(L, loadedChunk);
	free(loadedChunk);
	// call 'load' with 1 arguments and 1 result
	lua_call(L, 1, 1);
	
  return 1;
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

void exec_lua(std::string lua_src, std::string to_output_id) {
	const char* to_output_id_c = to_output_id.c_str();
	output_id = to_output_id_c;
	lua_State *L;
	L = luaL_newstate();
	luaopen_base(L);
	lua_register(L, "markdown_print", &l_markdown_print);
	lua_register(L, "require", &l_require);
	//luaL_openlibs(L);

	bool ok = loadLuaStringReturnPrefixed(L, lua_src, 1);
	size_t resultSize = 0;
	const char * result = luaL_tolstring(L, LUA_STACK_TOP, &resultSize);

	if (ok) {
		printf("%s", result);
	} else {
		error_print("%s", result);
	}

  lua_close(L);
	output_id = NULL;
	return;
}

EMSCRIPTEN_BINDINGS(my_module) {
  //emscripten::register_vector<std::string>("StringList");

  emscripten::function("exec_lua", &exec_lua);
}

