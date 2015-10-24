/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {basename, dirname} from 'path';

import {parse} from 'dotenv';
import extend from 'extend';
import {container} from 'needlepoint';
import {v4 as uuid} from 'node-uuid';

import Driver from 'polymerase-driver-aws-apigateway';

import {getConfigurationPath, getConfiguration, writeConfiguration} from '../../config';

export default function command(key, otherKeys, options) {
	if(!key) {
		console.error('You must provide at least one key to unset.');
		return process.exit(1);
	}

	if(!options.stage) {
		console.error('You must specify a stage to unset config items for.');
		return process.exit(1);
	}

	var config = getConfiguration(options.service);
	console.log('Found configuration file.');

	if(config.stages.indexOf(options.stage) < 0) {
		console.error('The stage ' + options.stage + ' does not exist.');
		return process.exit(1);
	}

	// Check the region if we're setting a regional config
	if(options.region && config.regions.indexOf(options.region) < 0) {
		console.error('The region ' + options.region + ' does not exist for this service.');
		return process.exit(1);
	}

	var keys = [key].concat(otherKeys);

	var driver = container.resolve(Driver);
	driver.setServiceContext(config);

	driver.getConfigObjects(options.stage, options.region, true)
		.then((config) => {
			keys.forEach((key) => {
				delete config.Body.data[key];
			});

			return driver.setConfig(config, options.stage, options.region);
		})
		.then(() => {
			console.log('Unset the config item(s) successfully.');
		});
};
