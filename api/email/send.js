'use strict';

const { handler, API } = require('vercel-serverless-api');
const { struct } = require('@janiscommerce/superstruct');
const Handlebars = require('handlebars');

const EmailSender = require('../../controllers/email-sender');

const templates = require('../../templates');

class SendEmailApi extends API {

	static get bodyStruct() {
		return struct.partial({
			templateCode: 'string',
			message: 'object',
			to: struct.optional(struct.intersection([['email'], '!empty']))
		});
	}

	validate() {

		this.template = templates[this.data.templateCode];

		if(!this.template) {
			this.setCode(404);
			throw new Error(`Cannot found Template ${this.data.templateCode}`);
		}

		this.emailsTo = [
			...this.template.to || [],
			...this.data.to || []
		];

		if(!this.emailsTo.length)
			throw new Error('Empty email addresses to send');

		if(!Object.keys(this.data.message))
			throw new Error('No Message data is sent');
	}

	async process() {

		const dataToSend = this.formatTemplate();

		const response = await EmailSender.send(dataToSend);

		this.setBody({
			...response.accepted && { emailSentTo: response.accepted },
			...response.rejected && { emailRejected: response.rejected }
		});
	}

	formatTemplate() {

		const templateToCompile = Handlebars.compile(this.template.html);

		return {
			subject: this.template.subject,
			to: this.emailsTo,
			html: templateToCompile(this.data.message)
		};
	}
}

module.exports = async (...args) => handler(SendEmailApi, ...args);
