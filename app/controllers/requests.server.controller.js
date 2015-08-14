'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Request = mongoose.model('Request'),
	_ = require('lodash');

/**
 * Create a Request
 */
exports.create = function(req, res) {
	var request = new Request(req.body),
	 		socketio = req.app.get('socketio');
	request.user = req.user;

	request.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			socketio.sockets.emit('article.created', 'article dhdhhdhd dhhdhdhd dhhdhdhhd dhhdhdhd hdhhd');
			res.jsonp(request);
		}
	});
};

/**
 * Show the current Request
 */
exports.read = function(req, res) {
	res.jsonp(req.request);
};

/**
 * Update a Request
 */
exports.update = function(req, res) {
	var request = req.request ;

	request = _.extend(request , req.body);

	request.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(request);
		}
	});
};

/**
 * Delete an Request
 */
exports.delete = function(req, res) {
	var request = req.request ;

	request.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(request);
		}
	});
};

/**
 * List of Requests
 */
exports.list = function(req, res) {
	Request.find().sort('-created').populate('user', 'displayName').exec(function(err, requests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(requests);
		}
	});
};

/**
 * Request middleware
 */
exports.requestByID = function(req, res, next, id) {
	Request.findById(id).populate('user', 'displayName').exec(function(err, request) {
		if (err) return next(err);
		if (! request) return next(new Error('Failed to load Request ' + id));
		req.request = request ;
		next();
	});
};

/**
 * Request authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.request.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
