import http from 'http'

import { HTTPParser } from 'http-parser-js'

export function parseBody(req: InstanceType<typeof http.IncomingMessage>): string {
	const parser = new HTTPParser(HTTPParser.REQUEST);

	parser.body = '';
	parser.bodyStart = 0;

	parser[HTTPParser.kOnBody | 0] = function (b: string, start: number) {
		if (!parser.bodyStart) {
			parser.bodyStart = start;
		}

		parser.body = b;
	};

	parser.execute(req, 0, req.readableLength);
	return parser.body.slice(parser.bodyStart);
};
