'use strict';

const VercelServerlessApiTests = require('vercel-serverless-tests');
const Nodemailer = require('nodemailer');

const { sinon } = VercelServerlessApiTests;

const SendEmailApi = require('../../../api/email/send');
const EmailSender = require('../../.././src/controllers/email-sender');
const defaultTemplate = require('../../../src/templates/default');

describe('Send Email API', () => {

	const ApiTest = new VercelServerlessApiTests(SendEmailApi);

	const data = {
		templateCode: 'default',
		message: {
			title: 'Hi!',
			mainText: 'It is a Test',
			secondaryText: 'Just an Example!'
		},
		to: [
			'example@test.com'
		]
	};

	ApiTest.contextTest('When request is invalid', [
		...['templateCode', 'message'].flatMap(field => [
			{
				description: `Should return 400 if field "${field}" is missing`,
				request: {
					body: {
						...data,
						[field]: undefined
					}
				},
				response: { status: 400 }
			},
			{
				description: `Should return 400 if field "${field}" is invalid`,
				request: {
					body: {
						...data,
						[field]: false
					}
				},
				response: { status: 400 }
			}
		]),
		{
			description: 'Should return 400 if field "to" is invalid',
			request: {
				body: {
					...data,
					to: false
				}
			},
			response: { status: 400 }
		}
	], {
		beforeEach: () => {
			sinon.stub(Nodemailer, 'createTransport');
		},
		afterEach: () => {
			sinon.assert.notCalled(Nodemailer.createTransport);
		}
	});

	ApiTest.contextTest('When cannot validate data to send', [
		{
			description: 'Should return 404 if cannot found the template',
			request: {
				body: {
					...data,
					templateCode: 'not'
				}
			},
			response: { status: 404 }
		},
		{
			description: 'Should return 400 if there is not any email address',
			request: {
				body: {
					...data,
					to: undefined
				}
			},
			response: { status: 400 }
		},
		{
			description: 'Should return 400 if there is not any message field',
			request: {
				body: {
					...data,
					message: {}
				}
			},
			response: { status: 400 }
		}
	], {
		beforeEach: () => {
			sinon.stub(Nodemailer, 'createTransport');
		},
		afterEach: () => {
			sinon.assert.notCalled(Nodemailer.createTransport);
		}
	});

	const envs = {};

	const emailUser = 'default@test.com';
	const appPass = 's3cret';

	const transporter = {
		sendMail: () => true
	};

	ApiTest.contextTest('When cannot send email', [
		{
			description: 'Should return 500 if cannot create the transporter',
			request: {
				body: data
			},
			response: { status: 500 },
			before: () => {
				sinon.stub(Nodemailer, 'createTransport').rejects();
			},
			after: () => {
				sinon.assert.calledOnceWithExactly(Nodemailer.createTransport, {
					service: 'Gmail',
					auth: {
						user: emailUser,
						pass: appPass
					}
				});
			}
		},
		{
			description: 'Should return 500 if fail transporter sending email',
			request: {
				body: data
			},
			response: { status: 500 },
			before: () => {
				EmailSender.transporter = undefined;
				sinon.stub(Nodemailer, 'createTransport').returns(transporter);
				sinon.stub(transporter, 'sendMail').rejects();
			},
			after: () => {
				sinon.assert.calledOnceWithExactly(Nodemailer.createTransport, {
					service: 'Gmail',
					auth: {
						user: emailUser,
						pass: appPass
					}
				});

				sinon.assert.calledOnceWithExactly(transporter.sendMail, {
					from: 'Rescuefy <proyecto.rescuefy@gmail.com>',
					to: data.to,
					subject: defaultTemplate.subject,
					html: sinon.match.string
				});
			}
		}
	], {
		before: () => {
			envs.EMAIL_USER = process.env.EMAIL_USER;
			envs.APP_PASS = process.env.APP_PASS;

			process.env.EMAIL_USER = emailUser;
			process.env.APP_PASS = appPass;
		},
		after: () => {
			process.env.EMAIL_USER = envs.EMAIL_USER;
			process.env.APP_PASS = envs.APP_PASS;
		}
	});

	ApiTest.contextTest('When can send email', [
		{
			description: 'Should return 200 and send email',
			request: {
				body: data
			},
			response: {
				status: 200,
				body: {
					emailSentTo: data.to
				}
			},
			before: () => {
				EmailSender.transporter = undefined;
				sinon.stub(Nodemailer, 'createTransport').returns(transporter);
				sinon.stub(transporter, 'sendMail').resolves({
					accepted: data.to
				});
			},
			after: () => {
				sinon.assert.calledOnceWithExactly(Nodemailer.createTransport, {
					service: 'Gmail',
					auth: {
						user: emailUser,
						pass: appPass
					}
				});

				sinon.assert.calledOnceWithExactly(transporter.sendMail, {
					from: 'Rescuefy <proyecto.rescuefy@gmail.com>',
					to: data.to,
					subject: defaultTemplate.subject,
					html: sinon.match.string
				});
			}
		},
		{
			description: 'Should return 200 and use the transporter in cache',
			request: {
				body: data
			},
			response: {
				status: 200,
				body: {
					emailSentTo: data.to
				}
			},
			before: () => {
				sinon.stub(Nodemailer, 'createTransport');
				sinon.stub(transporter, 'sendMail').resolves({
					accepted: data.to
				});
			},
			after: () => {
				sinon.assert.notCalled(Nodemailer.createTransport);

				sinon.assert.calledOnceWithExactly(transporter.sendMail, {
					from: 'Rescuefy <proyecto.rescuefy@gmail.com>',
					to: data.to,
					subject: defaultTemplate.subject,
					html: sinon.match.string
				});
			}
		},
		{
			description: 'Should return 200 and send email but it is rejected',
			request: {
				body: data
			},
			response: {
				status: 200,
				body: {
					emailRejected: data.to
				}
			},
			before: () => {
				EmailSender.transporter = undefined;
				sinon.stub(Nodemailer, 'createTransport').returns(transporter);
				sinon.stub(transporter, 'sendMail').resolves({
					rejected: data.to
				});
			},
			after: () => {
				sinon.assert.calledOnceWithExactly(Nodemailer.createTransport, {
					service: 'Gmail',
					auth: {
						user: emailUser,
						pass: appPass
					}
				});

				sinon.assert.calledOnceWithExactly(transporter.sendMail, {
					from: 'Rescuefy <proyecto.rescuefy@gmail.com>',
					to: data.to,
					subject: defaultTemplate.subject,
					html: sinon.match.string
				});
			}
		}
	], {
		before: () => {
			envs.EMAIL_USER = process.env.EMAIL_USER;
			envs.APP_PASS = process.env.APP_PASS;

			process.env.EMAIL_USER = emailUser;
			process.env.APP_PASS = appPass;
		},
		after: () => {
			process.env.EMAIL_USER = envs.EMAIL_USER;
			process.env.APP_PASS = envs.APP_PASS;
		}
	});
});
