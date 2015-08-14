'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var requests = require('../../app/controllers/requests.server.controller');

	// Requests Routes
	app.route('/requests')
		.get(requests.list)
		.post(users.requiresLogin, requests.create);

	app.route('/requests/:requestId')
		.get(requests.read)
		.put(users.requiresLogin, requests.hasAuthorization, requests.update)
		.delete(users.requiresLogin, requests.hasAuthorization, requests.delete);

	// Finish by binding the Request middleware
	app.param('requestId', requests.requestByID);
};
