
#include lua/Makefile



ifneq (,$(findstring wasm,$(MAKECMDGOALS)))
CC=emcc
endif


LUA_DIR=./lua/
LUA_BINDING_CC=../../src/lua-binding/lua-binding.cc
LUA_BINDING_O=../../src/lua-binding/lua-binding.o
SYSINC=-I./lua -I../../../src/lua-binding # -I../../fake-headers
INC=-I./lua -I../../src/lua-binding #-I../term -I../fake-headers
OUT_FILE=../../html/lua.js
SYSCFLAGS=-DLUA_USE_LINUX -include 'lua-binding.h' #-include 'lua-fixer.h' 
SYSLIBS=-Wl,-E -ldl -lm
LUA_EXTRA=MYCFLAGS="$(SYSCFLAGS) $(SYSINC)" MYLIBS="$(SYSLIBS)" CC="$(CC) -std=gnu99" RANLIB="emranlib" AR="emar rcu"
EMFLAGS=-lembind -sALLOW_MEMORY_GROWTH=1 -sASYNCIFY -sINVOKE_RUN=0 -s EXPORTED_RUNTIME_METHODS="['lengthBytesUTF8', 'stringToUTF8', 'stringToNewUTF8']"

wasm: 
	make -C $(LUA_DIR) a $(LUA_EXTRA)
#	make -C $(LUA_DIR) lua.o $(LUA_EXTRA)
	$(CC) $(SYSCFLAGS) -std=c++20 $(INC) $(SYSLIBS) $(LUA_DIR)liblua.a $(LUA_BINDING_CC) -o $(OUT_FILE) $(EMFLAGS)
clean:
	make -C $(LUA_DIR) clean


#make -C $(LUA_DIR) clean
