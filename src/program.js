/**
 * @package polymerase-cli
 * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
 */

var program = require('commander');

program
  .version(require('../package.json').version);

program
	.option('--access-key <key>', 'Access key used to authenticate with AWS')
	.option('--secret-key <secret>', 'Secret key used to authenticate with AWS');

program
	.command('service:create [folder]')
	.description('Create a new service in the specified folder')
	.option('--name [name]', 'Name to use for the service')
	.option('--description [description]', 'Description to use for the service')
	.action(require('./commands/service-create'));

program.parse(process.argv);

if(!process.argv.slice(2).length) {
  program.outputHelp();
}
