'use strict';

const defaultTemplate = require('./default');
const devs = require('./devs');
const users = require('./users');

module.exports = {
	default: defaultTemplate,
	devs,
	users
};
