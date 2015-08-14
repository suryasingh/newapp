'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Service Schema
 */
var ServiceSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	serviceType: {
		type: String,
		default: '',
		required: 'Please fill Service type',
		trim: true
	},
	serviceDetail: {
		type: {},
		required: 'Please fill Service Details',
		trim: true
	},
	rating: {
		type: Number,
		default: 0
	},
	feedback: {
		type: [{}]
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Service', ServiceSchema);
