# Lua Notebook

This is intended to be an input + markdown + lua mixed renderer.
It is intended for creating small calculators you can save to files
and serve as web apps easily. It is intended to allow a scripting context
that doesnt mess with the rest of its host context.

## Build

First activate emscripten `source emsdk_env.sh`

then

```
cd third-party/lua/
make -f lua-5.4.4.makefile wasm
cd ../../
```
