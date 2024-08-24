var exec_lua;

var Module = {
    onRuntimeInitialized: async function() {
				console.log("init");
				
    }
};

function print(s, output=null) {
		console.log(s);
		if (output) {
				output.textContent=s;
		}
}

function standardEditor(editor) {
		const inputElement = editor.getElementsByClassName("input")[0];
		const buttonRun = editor.getElementsByClassName("editor-run")[0];
		const output = editor.getElementsByClassName("output")[0];

		function eval(e) {
				let toEval = `return ${inputElement.value}`;
				const result = Module.exec_lua(toEval);
				console.log(`result is ${result}`);
				print(result, output);
				e.preventDefault();
		}
		inputElement.addEventListener("keypress", function(e){
				if(e.key == "Enter" && e.shiftKey) {
						eval(e);
				}
		});		
		buttonRun.addEventListener("click", function(e){
				eval(e);
		});		
}

Array.from(document.getElementsByClassName("standard-editor")).forEach(standardEditor);

Module.print = print;
