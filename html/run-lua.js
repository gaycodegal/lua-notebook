var exec_lua;

var Module = {
    onRuntimeInitialized: async function() {
				console.log("init");
				
    }
};

function print(s) {
		console.log('howdy');
    const output = document.getElementById("output");
		output.textContent=s;
}
