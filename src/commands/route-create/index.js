/**
 * @package polymerase-cli
 * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
 */

import {dirname} from 'path';

import {parse} from 'dotenv';
import extend from 'extend';
import {container} from 'needlepoint';
import {v4 as uuid} from 'node-uuid';

import Driver from 'polymerase-driver-aws-apigateway';

import {getConfigurationPath, getConfiguration, writeConfiguration} from '../../config';

export default function command(method, path, options) {
	if(!path) {
		console.error('You must specify an API path to create the route for.');
		return process.exit(1);
	}

	if(!method) {
		console.error('You must specify an HTTP method to create the route handler for.');
		return process.exit(1);
	}

	var config = getConfiguration(options.service);
	console.log('Found configuration file.');

	Promise.resolve(null)
		.then(function() {
			var driver = container.resolve(Driver);
			driver.setServiceContext(config);

			return driver.initializeRoute(dirname(getConfigurationPath(options.service)), path, {
				method: method
			});
		})
		.then(function(result) {
			if(result) {
				console.log('Created a new route (' + method + ' ' + path + ') for ' + config.name);
			} else {
				console.log('The specified route handler already exists.');
			}
		})
		.catch(function(err) {
			console.log(err.stack);
		});
};
