'use strict';

(function() {
	// Requests Controller Spec
	describe('Requests Controller Tests', function() {
		// Initialize global variables
		var RequestsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Requests controller.
			RequestsController = $controller('RequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Request object fetched from XHR', inject(function(Requests) {
			// Create sample Request using the Requests service
			var sampleRequest = new Requests({
				name: 'New Request'
			});

			// Create a sample Requests array that includes the new Request
			var sampleRequests = [sampleRequest];

			// Set GET response
			$httpBackend.expectGET('requests').respond(sampleRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.requests).toEqualData(sampleRequests);
		}));

		it('$scope.findOne() should create an array with one Request object fetched from XHR using a requestId URL parameter', inject(function(Requests) {
			// Define a sample Request object
			var sampleRequest = new Requests({
				name: 'New Request'
			});

			// Set the URL parameter
			$stateParams.requestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/requests\/([0-9a-fA-F]{24})$/).respond(sampleRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.request).toEqualData(sampleRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Requests) {
			// Create a sample Request object
			var sampleRequestPostData = new Requests({
				name: 'New Request'
			});

			// Create a sample Request response
			var sampleRequestResponse = new Requests({
				_id: '525cf20451979dea2c000001',
				name: 'New Request'
			});

			// Fixture mock form input values
			scope.name = 'New Request';

			// Set POST response
			$httpBackend.expectPOST('requests', sampleRequestPostData).respond(sampleRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Request was created
			expect($location.path()).toBe('/requests/' + sampleRequestResponse._id);
		}));

		it('$scope.update() should update a valid Request', inject(function(Requests) {
			// Define a sample Request put data
			var sampleRequestPutData = new Requests({
				_id: '525cf20451979dea2c000001',
				name: 'New Request'
			});

			// Mock Request in scope
			scope.request = sampleRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/requests/' + sampleRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid requestId and remove the Request from the scope', inject(function(Requests) {
			// Create new Request object
			var sampleRequest = new Requests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Requests array and include the Request
			scope.requests = [sampleRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.requests.length).toBe(0);
		}));
	});
}());