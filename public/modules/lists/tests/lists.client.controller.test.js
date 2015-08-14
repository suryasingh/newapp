'use strict';

(function() {
	// Lists Controller Spec
	describe('Lists Controller Tests', function() {
		// Initialize global variables
		var ListsController,
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

			// Initialize the Lists controller.
			ListsController = $controller('ListsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one List object fetched from XHR', inject(function(Lists) {
			// Create sample List using the Lists service
			var sampleList = new Lists({
				name: 'New List'
			});

			// Create a sample Lists array that includes the new List
			var sampleLists = [sampleList];

			// Set GET response
			$httpBackend.expectGET('lists').respond(sampleLists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lists).toEqualData(sampleLists);
		}));

		it('$scope.findOne() should create an array with one List object fetched from XHR using a listId URL parameter', inject(function(Lists) {
			// Define a sample List object
			var sampleList = new Lists({
				name: 'New List'
			});

			// Set the URL parameter
			$stateParams.listId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/lists\/([0-9a-fA-F]{24})$/).respond(sampleList);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.list).toEqualData(sampleList);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Lists) {
			// Create a sample List object
			var sampleListPostData = new Lists({
				name: 'New List'
			});

			// Create a sample List response
			var sampleListResponse = new Lists({
				_id: '525cf20451979dea2c000001',
				name: 'New List'
			});

			// Fixture mock form input values
			scope.name = 'New List';

			// Set POST response
			$httpBackend.expectPOST('lists', sampleListPostData).respond(sampleListResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the List was created
			expect($location.path()).toBe('/lists/' + sampleListResponse._id);
		}));

		it('$scope.update() should update a valid List', inject(function(Lists) {
			// Define a sample List put data
			var sampleListPutData = new Lists({
				_id: '525cf20451979dea2c000001',
				name: 'New List'
			});

			// Mock List in scope
			scope.list = sampleListPutData;

			// Set PUT response
			$httpBackend.expectPUT(/lists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/lists/' + sampleListPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid listId and remove the List from the scope', inject(function(Lists) {
			// Create new List object
			var sampleList = new Lists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Lists array and include the List
			scope.lists = [sampleList];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/lists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleList);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.lists.length).toBe(0);
		}));
	});
}());