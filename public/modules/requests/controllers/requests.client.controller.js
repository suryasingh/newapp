'use strict';

// Requests controller
angular.module('requests').controller('RequestsController', ['$scope', 'Socket', '$stateParams', '$location', 'Authentication', 'Requests',
	function($scope, Socket, $stateParams, $location, Authentication, Requests) {
		$scope.authentication = Authentication;

		// Create new Request
		$scope.create = function() {
			// Create new Request object
			var request = new Requests ({
				name: this.name
			});

			// Redirect after save
			request.$save(function(response) {
				$location.path('requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Request
		$scope.remove = function(request) {
			if ( request ) {
				request.$remove();

				for (var i in $scope.requests) {
					if ($scope.requests [i] === request) {
						$scope.requests.splice(i, 1);
					}
				}
			} else {
				$scope.request.$remove(function() {
					$location.path('requests');
				});
			}
		};

		// Update existing Request
		$scope.update = function() {
			var request = $scope.request;

			request.$update(function() {
				$location.path('requests/' + request._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Requests
		$scope.find = function() {
			$scope.requests = Requests.query();
		};

		// Find existing Request
		$scope.findOne = function() {
			$scope.request = Requests.get({
				requestId: $stateParams.requestId
			});
		};

		Socket.on('article.created', function(article) {
    	console.log(article);
		});
	}
]);
