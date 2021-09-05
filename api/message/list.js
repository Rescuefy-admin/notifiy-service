'use strict';

module.exports = async ({
	url, method, body, query, cookies, headers
}, res) => {
	res.json({
		name: 'Message GET List',
		url,
		method,
		...body && { body },
		...query && { query },
		...cookies && { cookies },
		...headers && { headers }
	});
};
