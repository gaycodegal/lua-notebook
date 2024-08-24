const scannerRE = /\%(input (?:text|number) .*)\%/g;

function input_maker_function(md) {
		md.core.ruler.after(
				'linkify',
				'inputs',
				create_rule(md)
		);
}

function create_rule (md) {
		const arrayReplaceAt = md.utils.arrayReplaceAt;
		function splitTextToken (text, level, Token) {
				let last_pos = 0;
				let nodes = text.split(scannerRE);
				nodes = nodes.map(function (match, index) {
						if (index % 2 == 0) {
								const token = new Token('text', '', 0);
								token.content = match;
								return token;
						} else {
								const token = new Token('html_inline', 'input', 0);
								const metadata = match.split(" ");
								
								token.content = `<input type="${metadata[1]}" id="${metadata[2]}" value="${metadata[3] ?? ""}"></input>`;
								return token;
						}
				});
				
				return nodes;
		}

		return function input_replace (state) {
				
				let token = null;
				const blockTokens = state.tokens;
				let autolinkLevel = 0;

				for (let j = 0, l = blockTokens.length; j < l; j++) {
						if (blockTokens[j].type !== 'inline') { continue }
						let tokens = blockTokens[j].children;

						// We scan from the end, to keep position when new tags added.
						// Use reversed logic in links start/end match
						for (let i = tokens.length - 1; i >= 0; i--) {
								token = tokens[i];
								if (token.type === 'link_open' || token.type === 'link_close') {
										if (token.info === 'auto') { autolinkLevel -= token.nesting }
								}

								if (token.type === 'text' && autolinkLevel === 0 && token.content.search(scannerRE) != -1) {
										// replace current node
										blockTokens[j].children = tokens = arrayReplaceAt(
												tokens, i, splitTextToken(token.content, token.level, state.Token)
										);
								}
						}
				}
		}
}
