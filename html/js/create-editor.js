function linkStandardEditor(editorObj) {
		const editor = editorObj.editor;
		const outputId = editorObj.outputId;
		const inputElement = editor.find(".input")[0];
		console.log(inputElement);
		const buttonRun = editor.find(".editor-run")[0];
		const buttonFocusInput = editor.find(".textarea-focuser")[0];
		const output = editor.find(".output")[0];

		function eval(e) {
				let toEval = `return ${inputElement.value}`;
				output.innerHTML = "";
				const result = Module.exec_lua(toEval, outputId);
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
function createSingleEditor() {
		const editor = makeSingleEditorHtml($("#editors-section"));
		linkStandardEditor(editor);
}
function makeSingleEditorHtml(parent) {
		const inputId = `input-${Math.random()}`;
		const outputId = `output-${Math.random()}`;
		const editor = $(`<section class="standard-editor">
				<pre class="output ${outputId}"></pre>
				<button class="textarea-focuser">
					<textarea
						tabindex="-1"
						class="input"
						type="text"
						autocorrect="off"
						spellcheck="false"
						autocapitalize="none"
						></textarea>
				</button>
				<button id="${inputId}" class="editor-run">run</button>
				<label
					style="display: block"
					for="${inputId}"
					>
					input when required.
				</label>
			</section>`);
		parent.append(editor);
		return {editor, outputId};
}


function editorOnLoad() {
		createSingleEditor();
}

window.addEventListener("load", editorOnLoad);

