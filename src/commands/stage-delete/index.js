/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {container} from 'needlepoint';

import Driver from 'polymerase-driver-aws-apigateway';

import {getConfiguration, writeConfiguration} from '../../config';

export default function command(name, options) {
	if(!name) {
		console.error('You must specify a stage name to delete.');
		return process.exit(1);
	}

	var config = getConfiguration(options.service);
	console.log('Found configuration file.');

	var i = config.stages.indexOf(name);
	if(i < 0) {
		console.error('That stage does not exist.');
		return process.exit(1);
	}

	// Validate whether the stage is the default or not
	if(config.stages.length < 2) {
		console.error('You cannot delete the only stage of a service.');
		return process.exit(1);
	}

	config.stages.splice(i, 1);
	writeConfiguration(options.service, config);

	console.log('Amended configuration file by deleting the stage ' + name + '.');

	Promise.resolve(null)
	.then(function() {
		var driver = container.resolve(Driver);
		driver.setServiceContext(config);

		return driver.deleteStage(name);
	})
	.then(function() {
		console.log('Deleted a stage (' + name + ') for ' + config.name);
	})
	.catch(function(err) {
		console.log(err.stack);
	});
};
