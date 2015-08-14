'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Request = mongoose.model('Request'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, request;

/**
 * Request routes tests
 */
describe('Request CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Request
		user.save(function() {
			request = {
				name: 'Request Name'
			};

			done();
		});
	});

	it('should be able to save Request instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request
				agent.post('/requests')
					.send(request)
					.expect(200)
					.end(function(requestSaveErr, requestSaveRes) {
						// Handle Request save error
						if (requestSaveErr) done(requestSaveErr);

						// Get a list of Requests
						agent.get('/requests')
							.end(function(requestsGetErr, requestsGetRes) {
								// Handle Request save error
								if (requestsGetErr) done(requestsGetErr);

								// Get Requests list
								var requests = requestsGetRes.body;

								// Set assertions
								(requests[0].user._id).should.equal(userId);
								(requests[0].name).should.match('Request Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Request instance if not logged in', function(done) {
		agent.post('/requests')
			.send(request)
			.expect(401)
			.end(function(requestSaveErr, requestSaveRes) {
				// Call the assertion callback
				done(requestSaveErr);
			});
	});

	it('should not be able to save Request instance if no name is provided', function(done) {
		// Invalidate name field
		request.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request
				agent.post('/requests')
					.send(request)
					.expect(400)
					.end(function(requestSaveErr, requestSaveRes) {
						// Set message assertion
						(requestSaveRes.body.message).should.match('Please fill Request name');
						
						// Handle Request save error
						done(requestSaveErr);
					});
			});
	});

	it('should be able to update Request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request
				agent.post('/requests')
					.send(request)
					.expect(200)
					.end(function(requestSaveErr, requestSaveRes) {
						// Handle Request save error
						if (requestSaveErr) done(requestSaveErr);

						// Update Request name
						request.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Request
						agent.put('/requests/' + requestSaveRes.body._id)
							.send(request)
							.expect(200)
							.end(function(requestUpdateErr, requestUpdateRes) {
								// Handle Request update error
								if (requestUpdateErr) done(requestUpdateErr);

								// Set assertions
								(requestUpdateRes.body._id).should.equal(requestSaveRes.body._id);
								(requestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Requests if not signed in', function(done) {
		// Create new Request model instance
		var requestObj = new Request(request);

		// Save the Request
		requestObj.save(function() {
			// Request Requests
			request(app).get('/requests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Request if not signed in', function(done) {
		// Create new Request model instance
		var requestObj = new Request(request);

		// Save the Request
		requestObj.save(function() {
			request(app).get('/requests/' + requestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', request.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Request
				agent.post('/requests')
					.send(request)
					.expect(200)
					.end(function(requestSaveErr, requestSaveRes) {
						// Handle Request save error
						if (requestSaveErr) done(requestSaveErr);

						// Delete existing Request
						agent.delete('/requests/' + requestSaveRes.body._id)
							.send(request)
							.expect(200)
							.end(function(requestDeleteErr, requestDeleteRes) {
								// Handle Request error error
								if (requestDeleteErr) done(requestDeleteErr);

								// Set assertions
								(requestDeleteRes.body._id).should.equal(requestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Request instance if not signed in', function(done) {
		// Set Request user 
		request.user = user;

		// Create new Request model instance
		var requestObj = new Request(request);

		// Save the Request
		requestObj.save(function() {
			// Try deleting Request
			request(app).delete('/requests/' + requestObj._id)
			.expect(401)
			.end(function(requestDeleteErr, requestDeleteRes) {
				// Set message assertion
				(requestDeleteRes.body.message).should.match('User is not logged in');

				// Handle Request error error
				done(requestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Request.remove().exec();
		done();
	});
});