'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	List = mongoose.model('List'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, list;

/**
 * List routes tests
 */
describe('List CRUD tests', function() {
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

		// Save a user to the test db and create new List
		user.save(function() {
			list = {
				name: 'List Name'
			};

			done();
		});
	});

	it('should be able to save List instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new List
				agent.post('/lists')
					.send(list)
					.expect(200)
					.end(function(listSaveErr, listSaveRes) {
						// Handle List save error
						if (listSaveErr) done(listSaveErr);

						// Get a list of Lists
						agent.get('/lists')
							.end(function(listsGetErr, listsGetRes) {
								// Handle List save error
								if (listsGetErr) done(listsGetErr);

								// Get Lists list
								var lists = listsGetRes.body;

								// Set assertions
								(lists[0].user._id).should.equal(userId);
								(lists[0].name).should.match('List Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save List instance if not logged in', function(done) {
		agent.post('/lists')
			.send(list)
			.expect(401)
			.end(function(listSaveErr, listSaveRes) {
				// Call the assertion callback
				done(listSaveErr);
			});
	});

	it('should not be able to save List instance if no name is provided', function(done) {
		// Invalidate name field
		list.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new List
				agent.post('/lists')
					.send(list)
					.expect(400)
					.end(function(listSaveErr, listSaveRes) {
						// Set message assertion
						(listSaveRes.body.message).should.match('Please fill List name');
						
						// Handle List save error
						done(listSaveErr);
					});
			});
	});

	it('should be able to update List instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new List
				agent.post('/lists')
					.send(list)
					.expect(200)
					.end(function(listSaveErr, listSaveRes) {
						// Handle List save error
						if (listSaveErr) done(listSaveErr);

						// Update List name
						list.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing List
						agent.put('/lists/' + listSaveRes.body._id)
							.send(list)
							.expect(200)
							.end(function(listUpdateErr, listUpdateRes) {
								// Handle List update error
								if (listUpdateErr) done(listUpdateErr);

								// Set assertions
								(listUpdateRes.body._id).should.equal(listSaveRes.body._id);
								(listUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Lists if not signed in', function(done) {
		// Create new List model instance
		var listObj = new List(list);

		// Save the List
		listObj.save(function() {
			// Request Lists
			request(app).get('/lists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single List if not signed in', function(done) {
		// Create new List model instance
		var listObj = new List(list);

		// Save the List
		listObj.save(function() {
			request(app).get('/lists/' + listObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', list.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete List instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new List
				agent.post('/lists')
					.send(list)
					.expect(200)
					.end(function(listSaveErr, listSaveRes) {
						// Handle List save error
						if (listSaveErr) done(listSaveErr);

						// Delete existing List
						agent.delete('/lists/' + listSaveRes.body._id)
							.send(list)
							.expect(200)
							.end(function(listDeleteErr, listDeleteRes) {
								// Handle List error error
								if (listDeleteErr) done(listDeleteErr);

								// Set assertions
								(listDeleteRes.body._id).should.equal(listSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete List instance if not signed in', function(done) {
		// Set List user 
		list.user = user;

		// Create new List model instance
		var listObj = new List(list);

		// Save the List
		listObj.save(function() {
			// Try deleting List
			request(app).delete('/lists/' + listObj._id)
			.expect(401)
			.end(function(listDeleteErr, listDeleteRes) {
				// Set message assertion
				(listDeleteRes.body.message).should.match('User is not logged in');

				// Handle List error error
				done(listDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		List.remove().exec();
		done();
	});
});