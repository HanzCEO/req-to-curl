export function escapeStringWindows(s: string): string {
	let escaped: string = s
	.replace(/"/g, "\"\"")
	.replace(/%/g, "\"%\"")
	.replace(/\\/g, "\\\\")
	.replace(/[\r\n]+/g, "\"^$&\"");

	return `"${escaped}"`;
};

export function escapeStringPosix(str: string): string {
	/* Derived from https://github.com/JarvusInnovations/node-request-to-curl/blob/b1f1373cf6d45051418eb2441ceee19ccb41f2a5/index.js#L69 */
	function escapeCharacter(x) {
		let code = x.charCodeAt(0);
		if (code < 256) {
			// Add leading zero when needed to not care about the next character.
			return code < 16 ? "\\x0" + code.toString(16) : "\\x" + code.toString(16);
		}
		code = code.toString(16);
		return "\\u" + ("0000" + code).substr(code.length, 4);
	}

	if (/[^\x20-\x7E]|\'/.test(str)) {
		// Use ANSI-C quoting syntax.
		return "$\'" + str.replace(/\\/g, "\\\\")
				.replace(/\'/g, "\\\'")
				.replace(/\n/g, "\\n")
				.replace(/\r/g, "\\r")
				.replace(/[^\x20-\x7E]/g, escapeCharacter) + "'";
	} else {
		// Use single quote syntax.
		return "'" + str + "'";
	}
};
