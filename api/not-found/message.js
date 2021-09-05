'use strict';

module.exports = async (req, res) => {
	res.json({
		message: 'Error: Cannot found API',
		url: req.url
	});
};
