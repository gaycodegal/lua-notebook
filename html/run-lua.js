var exec_lua;

var Module = {
    onRuntimeInitialized: async function() {
				console.log("init");
				
    }
};

function print(s) {
		console.log(s);
    const output = document.getElementById("output");
		output.textContent=s;
}

const inputElement = document.getElementById("input");
inputElement.addEventListener("keypress", function(e){
		if(e.keyCode == 13) {
				print(Module.exec_lua(`return ${inputElement.value}`));
		}
});

Module.print = print;
