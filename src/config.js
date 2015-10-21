import {readFileSync, statSync, writeFileSync} from 'fs';
import {basename, dirname, join, resolve} from 'path';

import {sync as mkpath} from 'mkpath';

/**
 * Get the path to the configuration file, given a folder.
 * @param  {string} folder
 */
export function getConfigurationPath(folder) {
	var dir = folder && folder.trim().length ? resolve(folder, '.') : process.cwd();

	return join(dir, 'polymerase.json');
};

/**
 * Get the Polymerase configuration from the specified folder, throwing an error
 * if the folder does not exist or is not a Polymerase app.
 * @param  {string} folder
 * @return {objecy} Configuration for the Polymerase service
 */
export function getConfiguration(folder) {
	var configPath = getConfigurationPath(folder);

	try {
		var configStat = statSync(configPath);
	} catch(e) {
		// The config file probably doesn't exist, so we can create it now.
		throw new Error('The specified path is not a service');
	}

	return JSON.parse(readFileSync(configPath, { encoding: 'utf8' }));
};

/**
 * Write the configuration for the specified service folder. If the folder does
 * not exist, it will be created along with the Polymerase manifest JSON file.
 * @param  {string} folder
 * @param  {object} configuration
 */
export function writeConfiguration(folder, configuration) {
	var configPath = getConfigurationPath(folder);

	mkpath(dirname(configPath));

	writeFileSync(configPath, JSON.stringify(configuration, null, 4), {
		encoding: 'utf8',
		flag: 'wx'
	});
};
