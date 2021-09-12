'use strict';

const { handler, API } = require('vercel-serverless-api');

class CannotFoundAPI extends API {

	process() {
		this.setCode(404).setBody({
			message: 'Cannot found API',
			error: {
				url: this.request.url,
				method: this.request.method
			}
		});
	}
}

module.exports = async (...args) => handler(CannotFoundAPI, ...args);
