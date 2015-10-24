/**
 * @package polymerase-cli
 * @copyright 2015 Andrew Munsell <andrew@wizardapps.net>
 */

var program = require('commander');

program
  .version(require('../package.json').version);

program
	.command('service:create [folder]')
	.description('Create a new service in the specified folder')
	.option('--type [type]', 'Type of service to create. Default: aws-apigateway')
	.option('--name [name]', 'Name to use for the service')
	.option('--description [description]', 'Description to use for the service')
	.action(require('./commands/service-create'));

program
	.command('service:deploy [folder]')
	.description('Deploy all routes and workers in the specified service')
	.option('--stage <stage>', 'Stage to deploy to');

program
	.command('service:destroy [folder]')
	.description('Destroy the service and all its resources')
	.action(require('./commands/service-destroy'));

program
	.command('region:add <region>')
	.description('Add the service to the specified region')
	.option('--service <service>', 'Folder of the service to add the region for')
	.option('--stage <stage>', 'Stage to add the region for')

program
	.command('region:delete <region>')
	.description('Remove the service from the specified region')
	.option('--service <service>', 'Folder of the service to remove the region for')
	.option('--stage <stage>', 'Stage to delete the region for')

program
	.command('stage:create <name>')
	.description('Create a new stage for the service with the specified name')
	.option('--service <service>', 'Folder of the service to create the stage for')
	.action(require('./commands/stage-create'));

program
	.command('stage:clone <source>')
	.description('Clone the stage from the source to the specified destination')
	.option('--destination', 'Destination stage name')
	.option('--service <service>', 'Folder of the service to create the stage for')

program
	.command('stage:delete <name>')
	.description('Delete the specified stage for the service')
	.option('--service <service>', 'Folder of the service to delete the stage for')
	.action(require('./commands/stage-delete'));

program
	.command('stage:list')
	.description('List all of the stages for the service')
	.option('--service <service>', 'Folder of the service to list the stage for')

program
	.command('stage:set-default <name>')
	.description('Set the stage as the default for a service')
	.option('--service <service>', 'Folder of the service to set the default stage for')

program
	.command('route:create <path>')
	.description('Create a new route at the specified path relative to the API root')
	.option('--service <service>', 'Folder of the service to create the route for')

program
	.command('route:deploy <path>')
	.description('Deploy the route at the specified path')
	.option('--stage <stage>', 'Stage to deploy the route to')
	.option('--service <service>', 'Folder of the service to create the route for')

program
	.command('config:list')
	.description('List all of the configuration values.')
	.option('--stage <stage>', 'Stage to list the configuration items for')
	.option('--region <region>', 'Region to list the configuration items for')
	.option('--service <service>', 'Folder of the service to list the configuration items for')
	.action(require('./commands/config-list'));

program
	.command('config:get <key> [otherKeys...]')
	.description('Get one or more configuration values.')
	.option('--stage <stage>', 'Stage to get the configuration items for')
	.option('--region <region>', 'Region to get the configuration items for')
	.option('--service <service>', 'Folder of the service to get the configuration items for')
	.action(require('./commands/config-get'));

program
	.command('config:set <keyValuePair> [otherKeyValuePairs...]')
	.description('Set one or more configuration item(s)')
	.option('--stage <stage>', 'Stage to change the configuration items for')
	.option('--region <region>', 'Region to set the configuration items for')
	.option('--service <service>', 'Folder of the service to set the configuration items for')
	.action(require('./commands/config-set'));

program
	.command('config:unset <key> [otherKeys...]')
	.description('Unset the configuration key(s)')
	.option('--stage <stage>', 'Stage to change the configuration items for')
	.option('--region <region>', 'Region to unset the configuration items for')
	.option('--service <service>', 'Folder of the service to unset the configuration items for')
	.action(require('./commands/config-unset'));

program.parse(process.argv);

if(!process.argv.slice(2).length) {
  program.outputHelp();
}
