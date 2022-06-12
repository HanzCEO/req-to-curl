import http from 'http'
import { format as urlFormat } from 'url'
import { platform as getPlatform } from 'os'

import { parseBody } from './parser'
import { escapeStringWindows, escapeStringPosix } from './escape'
import { Command } from './command'

export type WithCurl = (InstanceType<typeof http.IncomingMessage>) & { toCurl: Function };

export type Platform = 'win' | 'posix';
export const ignoredHeaders: string[] = [
	'host', 'method', 'path', 'scheme', 'version', 'set-cookie',
	'content-length'
];

export function escape(s: string): string {
	const platform: Platform = getPlatform().startsWith('win') ? 'win' : 'posix';

	if (platform == 'win') {
		return escapeStringWindows(s);
	} else if (platform == 'posix') {
		return escapeStringPosix(s);
	}
};

export function toCurl() {
	const cmd: Command = new Command();

	// Add request destination
	cmd.add_arg(`${this.protocol}://${this.headers.host}${this.originalUrl}`);

	// Request Method
	cmd.add_option("-X", this.method);

	// Request headers
	for (const key in this.headers) {
		if (ignoredHeaders.includes(key.toLowerCase())) continue;

		cmd.add_flag("-H " + escape(`${key}: ${this.headers[key]}`));
	}

	if (getPlatform().startsWith('posix')) {
		cmd.add_flag("--compressed");
	}

	if (process.env.NODE_TLS_REJECT_UNAUTHORIZED == '0') {
		cmd.add_flag("--insecure");
	}

	const contentType = this.headers['content-type'];
	const reqBody = parseBody(this).toString();

	if (reqBody) {
		let flag: string = "--data-binary";

		if (contentType?.startsWith('application/x-www-form-urlencoded')) {
			flag = "--data";
		}
		// TODO: --data-raw?

		cmd.add_option(flag, escape(reqBody));
	}

	return cmd.toString();
};

export function bind() {
	// This only applies to express.js currently
	(http.IncomingMessage.prototype as WithCurl).toCurl = toCurl;
};
