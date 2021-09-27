'use strict';

module.exports = class Logger {

	static init(apiName) {
		this.apiName = apiName;
		return this;
	}

	static info(message) {

		if(!message || process.env.TEST_ENV)
			return;

		console.log(`[INFO ${this.apiName || 'API'}] - (${new Date()}) - ${this.formatMessage(message)}`);
		return this;
	}

	static error(message) {

		if(!message || process.env.TEST_ENV)
			return;

		console.error(`[ERROR ${this.apiName || 'API'}] - (${new Date()}) - ${this.formatMessage(message)}`);
		return this;
	}

	static formatMessage(message) {
		return typeof message === 'object' ? JSON.stringify(message, null, 4) : message;
	}
};
