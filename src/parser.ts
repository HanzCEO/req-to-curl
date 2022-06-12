import http from 'http'

import { HTTPParser } from 'http-parser-js'

type CustomParser = InstanceType<typeof HTTPParser> & { body?: string; bodyStart?: number };

export function parseBody(req: InstanceType<typeof http.IncomingMessage>): string {
	const parser: CustomParser = new HTTPParser(HTTPParser.REQUEST);

	parser.body = '';
	parser.bodyStart = 0;

	parser[HTTPParser.kOnBody | 0] = function (b: string, start: number) {
		if (!parser.bodyStart) {
			parser.bodyStart = start;
		}

		parser.body = b;
	};

	// XXX: req as Buffer is a bad idea
	parser.execute(req as unknown as Buffer, 0, req.readableLength);
	return parser.body.slice(parser.bodyStart);
};
