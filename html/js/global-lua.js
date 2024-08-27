var mark_instance = markdownit().use(markdown_it_input_plugin);

var Module = {
    onRuntimeInitialized: async function() {
				console.log("wasm loaded");
				
    }
};


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

Module.print_id = print;
Module.print_id = print_id;
Module.error_print_id = error_print_id;
Module.markdown_print_id = markdown_print_id;
