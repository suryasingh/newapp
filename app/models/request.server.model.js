'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Request Schema
 */
var RequestSchema = new Schema({
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
	quotes: {
		type: Number,
		required: 'Please select the Quotes'
	},
	location: {
		houseNo: {
			type: String,
			default: '',
			trim: true
		},
		street: {
			type: String,
			default: '',
			trim: true
		},
		city: {
			type: String,
			default: '',
			trim: true
		},
		zip: {
			type: String,
			default: '',
			trim: true
		},
		state: {
			type: String,
			default: '',
			trim: true
		},
		country: {
			type: String,
			default: '',
			trim: true
		},
		coordinates: {
			lat: {
				type: Number
			},
			lng: {
				type: Number
			}
		}
	},
	broadCastList: {
		type: [{
			provider: {
				type: Schema.ObjectId,
				ref: 'User'
			},
			acceptedByProvider: {
				type: Boolean,
				default: false
			}
		}]
	},
	acceptedByUser: {
		type: Boolean,
		default: false
	},
	processCompleted: {
		type: Boolean,
		default: false
	},
	expired: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Request', RequestSchema);
