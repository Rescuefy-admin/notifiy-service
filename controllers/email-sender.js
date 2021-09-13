'use strict';

const NodeMailer = require('nodemailer');

const getAccessToken = require('./google-suit/get-access-token');

module.exports = class EmailSender {

	static async setTransporter() {

		const accessToken = await getAccessToken();

		this.transporter = NodeMailer.createTransport({
			service: 'Gmail',
			auth: {
				type: 'OAuth2',
				user: process.env.EMAIL_USER,
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken
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
