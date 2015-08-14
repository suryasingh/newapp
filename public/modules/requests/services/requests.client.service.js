'use strict';

//Requests service used to communicate Requests REST endpoints
angular.module('requests').factory('Requests', ['$resource',
	function($resource) {
		return $resource('requests/:requestId', { requestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);