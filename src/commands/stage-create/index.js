/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {container} from 'needlepoint';

import Driver from 'polymerase-driver-aws-apigateway';

import {getConfiguration, writeConfiguration} from '../../config';

export default function command(name, options) {
	if(!name) {
		console.error('You must specify a stage name.');
		return process.exit(1);
	}

	var config = getConfiguration(options.service);
	console.log('Found configuration file.');

	config.stages.push(name);
	writeConfiguration(options.service, config);

	console.log('Amended configuration file with new stage.');

	Promise.resolve(null)
	.then(function() {
		var driver = container.resolve(Driver);
		driver.setServiceContext(config);

		return driver.createStage(name);
	})
	.then(function() {
		console.log('Created a new stage (' + name + ') for ' + config.name);
	})
	.catch(function(err) {
		console.log(err.stack);
	});
};
