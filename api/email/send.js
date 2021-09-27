'use strict';

const { handler } = require('vercel-serverless-api');

const SendEmailApi = require('../../src/apis/email/send');

module.exports = async (...args) => handler(SendEmailApi, ...args);
