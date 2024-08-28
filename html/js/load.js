async function getFile(url) {
    const response = await fetch(url);
    return await response.text();
}

let files = (async function (files) {
		for (const file of Object.keys(files)) {
				files[file] = await files[file];
		}
		return files;
})({json: getFile("./third-party/lua/json.lua")});

function js_lua_require(name){
		console.log("load", name);
		return files[name];
}
