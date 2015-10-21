/**
* @package polymerase-cli
* @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
*/

import {readFileSync, statSync, unlinkSync, writeFileSync} from 'fs';
import {basename, join, resolve} from 'path';

import {sync as mkpath} from 'mkpath';
import {container} from 'needlepoint';
import {v4 as uuid} from 'node-uuid';

import Driver from 'polymerase-driver-aws-apigateway';

export default function command(folder, options) {
	var dir = folder && folder.trim().length ? resolve(folder, '.') : process.cwd();
	var name = typeof options.name == 'string' ? options.name : basename(dir);

	var configPath = join(dir, 'polymerase.json');

	// We only support API Gateway at this point
	if(options.type && options.type != 'aws-apigateway') {
		console.error('You specified an invalid service type.');
		return process.exit(1);
	}

	try {
		var configStat = statSync(configPath);

		console.error('The specified folder is already a Polymerase service.');
		return process.exit(1);
	} catch(e) {
		// The config file probably doesn't exist, so we can create it now.
	}

	mkpath(dir);

	var defaultConfig = {
		id: uuid().substr(0, 13),
		name: name,
		version: '0.0.1',

		type: 'aws-apigateway',

		stages: {
			default: 'default',
			all: [
				'default'
			]
		},

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

	writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4), {
		encoding: 'utf8',
		flag: 'wx'
	});

	var config = JSON.parse(readFileSync(configPath, { encoding: 'utf8' }));

	console.log('Created configuration file.');
	console.log('Initializing the resources for your ' + config.type + ' service');

	Promise.resolve(null)
	.then(function() {
		var driver = container.resolve(Driver);

		return driver.createService(config);
	})
	.then(function() {
		console.log('Created a new service (' + name + ') in ' + dir);
	})
	.catch(function(err) {
		console.log(err.stack)
	});
};
