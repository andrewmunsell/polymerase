/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {basename, dirname} from 'path';

import {parse} from 'dotenv';
import {container} from 'needlepoint';
import {v4 as uuid} from 'node-uuid';

import Driver from 'polymerase-driver-aws-apigateway';

import {getConfigurationPath, getConfiguration, writeConfiguration} from '../../config';

export default function command(options) {
	if(!options.stage) {
		console.error('You must specify a stage to list the config for.');
		return process.exit(1);
	}

	var config = getConfiguration(options.service);
	console.log('Found configuration file.');

	if(config.stages.indexOf(options.stage) < 0) {
		console.error('The stage ' + options.stage + ' does not exist.');
		return process.exit(1);
	}

	// Check the region if we're getting a regional config
	if(options.region && config.regions.indexOf(options.region) < 0) {
		console.error('The region ' + options.region + ' does not exist for this service.');
		return process.exit(1);
	}

	var driver = container.resolve(Driver);
	driver.setServiceContext(config);

	driver.getConfigObjects(options.stage, options.region, true)
		.then((config) => {
			if(Object.keys(config.Body.data).length < 1) {
				console.log('There are no configuration values set.');
			}

			Object.keys(config.Body.data).forEach((key) => {
				console.log([key, config.Body.data[key]].join('='));
			});
		});
};
