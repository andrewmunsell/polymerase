/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {basename, dirname} from 'path';

import chalk from 'chalk';
import Promise from 'bluebird';
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

	var regions = [];

	var promises = [
		// Get the stage level configuration
		driver.getConfigObjects(options.stage, undefined, true)
	]
	.concat(config.regions.map((region) => {
		regions.push(region);

		return driver.getConfigObjects(options.stage, region, true);
	}));

	Promise.all(promises)
		.map((config) => {
			return config.Body.data;
		})
		.then((configs) => {
			var keySet = configs
				.map((config) => {
					return Object.keys(config);
				})
				.reduce((keySet, configKeys) => {
					configKeys.forEach((configKey) => {
						keySet.add(configKey);
					});

					return keySet;
				}, new Set());

			keySet.forEach((key) => {
				if(configs[0].hasOwnProperty(key)) {
					console.log(chalk.dim('[all] ') + key + '=' + configs[0][key]);
				} else {
					console.log(chalk.dim('[all] ' + key));
				}

				// For each region, display the override
				regions.forEach((region, i) => {
					if(!configs[i + 1].hasOwnProperty(key)) {
						return;
					}

					var log = '├── ';
					if(i == regions.length - 1) {
						// If this is the last item, we use a different line prefix
						log = '└── ';
					}

					if(options.region == region) {
						log += chalk.bold('[' + region + ']');
					} else {
						log += chalk.dim('[' + region + ']');
					}

					log += ' ' + key + '=' + configs[i + 1][key];

					console.log(log);
				});
			});

			if(keySet.size < 1) {
				console.log(chalk.dim('There are no configuration values set for this'
					+ ' stage.'));
			}
		});
};
