/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {basename, dirname, join} from 'path';

import {sync as mkpath} from 'mkpath';
import {container} from 'needlepoint';
import {v4 as uuid} from 'node-uuid';

import Driver from 'polymerase-driver-aws-apigateway';

import {getConfigurationPath, getConfiguration, writeConfiguration} from '../../config';

export default function command(folder, options) {
	// We only support API Gateway at this point
	if(options.type && options.type != 'aws-apigateway') {
		console.error('You specified an invalid service type.');
		return process.exit(1);
	}

	var configPath = getConfigurationPath(folder);
	var name = typeof options.name == 'string' ? options.name :
		basename(dirname(configPath));

	// Create the src and test directories for the service, which will hold the
	// code for the service.
	mkpath(join(dirname(configPath), 'src'));
	mkpath(join(dirname(configPath), 'test'));

	var defaultConfig = {
		id: uuid().substr(0, 13),
		name: name,
		version: '0.0.1',

		type: 'aws-apigateway',

		stages: ['default'],

		regions: [
			'us-east-1'
		],

		repository: {},

		manifest: {
			version: '1.0.0'
		}
	};

	if(options.description) {
		defaultConfig.description = options.description;
	}

	writeConfiguration(folder, defaultConfig);
	var config = getConfiguration(folder);

	console.log('Created configuration file.');
	console.log('Initializing the resources for your ' + config.type + ' service');

	Promise.resolve(null)
	.then(function() {
		var driver = container.resolve(Driver);

		return driver.createService(config);
	})
	.then(function() {
		console.log('Created a new service (' + name + ') in ' + configPath);
	})
	.catch(function(err) {
		console.log(err.stack)
	});
};
