'use strict';

const { handler, API } = require('vercel-serverless-api');
const { struct } = require('@janiscommerce/superstruct');

class SendEmailApi extends API {

	static get bodyStruct() {
		return struct.partial({
			templateCode: struct.enum(['devs', 'users']),
			data: 'object',
			to: struct.optional(struct.intersection([['email'], '!empty']))
		});
	}

	process() {
		this.setBody({
			...this.request,
			body: this.data
		});
	}
}

module.exports = async (...args) => handler(SendEmailApi, ...args);
