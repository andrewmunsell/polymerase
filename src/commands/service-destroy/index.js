/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {container} from 'needlepoint';

import Driver from 'polymerase-driver-aws-apigateway';

import {getConfigurationPath, getConfiguration, writeConfiguration} from '../../config';

export default function command(folder, options) {
	var dir = getConfigurationPath(folder);

	try {
		var config = getConfiguration(folder);
	} catch(e) {
		// The config file doesn't exist, so this isn't a Polymerase service
		console.error('A service doesn\'t exist at the specified path');
		return process.exit(1);
	}

	console.log('Found configuration file.');
	console.log('Destroying the resources for your service');

	Promise.resolve(null)
	.then(function() {
		var driver = container.resolve(Driver);
		driver.setServiceContext(config);

		return driver.deleteService();
	})
	.then(function() {
		console.log('Destroyed the resources for the service (' + name + ') in ' + dir);
	})
	.catch(function(err) {
		console.log(err.stack);
	});
};
