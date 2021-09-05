'use strict';

module.exports = async ({
	url, method, body, query, cookies, headers
}, res) => {
	res.json({
		name: 'Message GET Individual By Id',
		url,
		method,
		...body && { body },
		...query && { query },
		...cookies && { cookies },
		...headers && { headers }
	});
};
