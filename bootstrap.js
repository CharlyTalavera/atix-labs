const config = require('./config/constants.js');
const requireDir = require('require-dir');
const controllers = requireDir(config.controllers);
const services = requireDir(config.services);
const routes = require(config.routes);

global.config = config;
global._ = require('lodash');


function loadControllers(app){
	for (const [route, handler] of Object.entries(routes)){

		const method = route.split(' ').shift().toLowerCase();
		const endpoint = route.split(' ').pop();
		const controller = handler.split('.').shift();
		const func = handler.split('.').pop();
		
		if(_.isUndefined(controllers[controller])){
			console.warn(`Cannot find controller '${controller}' in controllers dir, skipping...`);
			continue;
		}

		if(_.isUndefined(controllers[controller][func])){
			console.warn(`Cannot find function '${func}' in controller ${controller}, skipping...`);
			continue;
		}

		app[method](endpoint, controllers[controller][func]);
	}
		
}

function loadServices(){
	for( [serviceName, service] of Object.entries(services))
		global[serviceName] = service;

	global.StorageService = global[`${config.storage_service}Service`];
}

module.exports = function bootstrap(app){
	loadControllers(app);
	loadServices();
}