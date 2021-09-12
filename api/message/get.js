'use strict';

const { handler, API } = require('vercel-serverless-api');

class MessageGetApi extends API {

	process() {
		this.setBody({
			name: 'Message GET Individual By Id',
			...this.request,
			pathParameters: this.pathIds,
			queries: {
				...this.query,
				filters: this.filters,
				sort: this.sort
			}
		});
	}
}

module.exports = async (...args) => handler(MessageGetApi, ...args);
