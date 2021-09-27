'use strict';

const { API } = require('vercel-serverless-api');
const Handlebars = require('handlebars');

const logger = require('../../lib/logger').init('Send Email API');

const EmailSender = require('../../controllers/email-sender');
const Templates = require('../../templates');

const structEmail = require('../../structs/email/send');

module.exports = class SendEmailApi extends API {

	static get bodyStruct() {
		return structEmail;
	}

	validate() {

		this.template = Templates[this.data.templateCode];

		if(!this.template) {

			const message = `Cannot found Template ${this.data.templateCode}`;
			logger.error(message);

			this.setCode(404);
			throw new Error(message);
		}

		this.emailsTo = [
			...this.template.to || [],
			...this.data.to || []
		];

		if(!this.emailsTo.length) {

			const message = 'Empty email addresses to send';

			logger.error(message);
			throw new Error(message);
		}

		if(!Object.keys(this.data.message).length) {

			const message = 'No Message data is sent';

			logger.error(message);
			throw new Error(message);
		}
	}

	async process() {

		logger.info(`Send Email type: ${this.data.templateCode}, to: ${this.emailsTo.join(', ')}`);

		const dataToSend = this.formatTemplate();

		const response = await EmailSender.send(dataToSend);

		if(response.accepted?.length)
			logger.info(`Emails sended to ${response.accepted.join(', ')}`);

		if(response.rejected?.length)
			logger.error(`Emails rejected to ${response.rejected.join(', ')}`);

		this.setBody({
			...response.accepted?.length && { emailSentTo: response.accepted },
			...response.rejected?.length && { emailRejected: response.rejected }
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
};
