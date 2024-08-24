var exec_lua;
var mark_instance = markdownit().use(markdown_it_input_plugin);

var Module = {
    onRuntimeInitialized: async function() {
				console.log("init");
				
    }
};

function div(text) {
		const div = document.createElement("div");
		div.textContent = text;
		return div;
}

function print(s, output=null) {
		console.log(s);
		if (output) {
				output.appendChild(div(s));
		}
}

function print_id(id, s) {
		const output = document.getElementsByClassName(id)[0];
		console.log(s);
		if (output) {
				if(output.classList.contains("error")) {
						output.classList.remove("error");
				}
				output.appendChild(div(s));
		}
}

function error_print_id(id, s) {
		const output = document.getElementsByClassName(id)[0];
		console.log(s);
		if (output) {
				if(!output.classList.contains("error")) {
						output.classList.add("error");
				}
				output.appendChild(div(s));
		}
}

function markdown_print_id(id, s) {
		const output = document.getElementsByClassName(id)[0];
		console.log(s);
		if (output) {
				if(!output.classList.contains("error")) {
						output.classList.remove("error");
				}
				const result = div("");
				result.innerHTML = mark_instance.render(s);
				output.appendChild(result);
		}
}

function standardEditor(editor) {
		const inputElement = editor.getElementsByClassName("input")[0];
		const buttonRun = editor.getElementsByClassName("editor-run")[0];
		const buttonFocusInput = editor.getElementsByClassName("textarea-focuser")[0];
		const output = editor.getElementsByClassName("output")[0];

		function eval(e) {
				let toEval = `return ${inputElement.value}`;
				output.innerHTML = "";
				const result = Module.exec_lua(toEval, "output");
				//print(result, output);
				e.preventDefault();
		}

		function indexOfNewline(value, start) {
				return Math.min(value.length, Math.max(0, value.lastIndexOf("\n", start - 1) + 1));
		}

		inputElement.addEventListener("keydown", function(e){
				// there is a bug if tab addition/deletion is inside selected range
				if (e.key == 'Tab') {
						if (e.shiftKey) {
								e.preventDefault();
								const start = this.selectionStart;
								const end = this.selectionEnd;
								const changeStart = indexOfNewline(this.value, start);
								console.log(JSON.stringify(this.value.charAt(changeStart)));
								if (this.value.charAt(changeStart) == "\t") {
										this.value = this.value.substring(0, changeStart) + this.value.substring(changeStart+1);
										// fix selection
										this.selectionStart = start - 1;
										this.selectionEnd = end - 1;
								}


						} else {
								e.preventDefault();
								const start = this.selectionStart;
								const end = this.selectionEnd;
								const changeStart = indexOfNewline(this.value, start);
								this.value = this.value.substring(0, changeStart) +
										"\t" + this.value.substring(changeStart);

								// fix selection
								this.selectionStart = start + 1;
								this.selectionEnd = end + 1;
						}
				}
				if(e.key == "Escape") {
						buttonFocusInput.focus();
				}
				e.stopPropagation();
		});
		inputElement.addEventListener("keypress", function(e){
				if(e.key == "Enter" && e.shiftKey) {
						eval(e);
				}
		});
		buttonFocusInput.addEventListener("click", function(e){
				inputElement.focus();
		});
		buttonRun.addEventListener("click", function(e){
				eval(e);
		});		
}

Array.from(document.getElementsByClassName("standard-editor")).forEach(standardEditor);

Module.print_id = print;
Module.print_id = print_id;
Module.error_print_id = error_print_id;
Module.markdown_print_id = markdown_print_id;
