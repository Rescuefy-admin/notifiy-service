'use strict';

const { struct } = require('@janiscommerce/superstruct');

module.exports = struct.partial({
	templateCode: 'string',
	message: 'object',
	to: struct.optional(struct.intersection([['email'], '!empty']))
});
