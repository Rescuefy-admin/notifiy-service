'use strict';

const NodeMailer = require('nodemailer');

module.exports = class EmailSender {

	static async setTransporter() {

		this.transporter = NodeMailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.APP_PASS
			}
		});
	}

	static async send({
		to,
		html,
		subject
	}) {

		if(!this.transporter)
			await this.setTransporter();

		return this.transporter.sendMail({
			from: 'Rescuefy <proyecto.rescuefy@gmail.com>',
			to,
			subject,
			html
		});
	}
};
