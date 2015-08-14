'use strict';

//Setting up route
angular.module('requests').config(['$stateProvider',
	function($stateProvider) {
		// Requests state routing
		$stateProvider.
		state('listRequests', {
			url: '/requests',
			templateUrl: 'modules/requests/views/list-requests.client.view.html'
		}).
		state('createRequest', {
			url: '/requests/create',
			templateUrl: 'modules/requests/views/create-request.client.view.html'
		}).
		state('viewRequest', {
			url: '/requests/:requestId',
			templateUrl: 'modules/requests/views/view-request.client.view.html'
		}).
		state('editRequest', {
			url: '/requests/:requestId/edit',
			templateUrl: 'modules/requests/views/edit-request.client.view.html'
		});
	}
]);