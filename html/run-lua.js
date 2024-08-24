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
		if(e.key == "Enter" && !e.shiftKey) {
				const result = Module.exec_lua(`return ${inputElement.value}`);
				console.log(`result is ${result}`);
				print(result);
		}
});

Module.print = print;
