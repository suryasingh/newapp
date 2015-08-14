'use strict';

//Lists service used to communicate Lists REST endpoints
angular.module('lists').factory('Lists', ['$resource',
	function($resource) {
		return $resource('lists/:listId', { listId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);