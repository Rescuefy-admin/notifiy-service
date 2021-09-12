'use strict';

const { handler, API } = require('vercel-serverless-api');

class MessageListApi extends API {

	process() {
		this.setBody({
			name: 'Message GET List',
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

module.exports = async (...args) => handler(MessageListApi, ...args);
