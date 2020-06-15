const requireDir = require('require-dir');
const config = require('./config/constants.js');
const controllers = requireDir(config.controllers);
const services = requireDir(config.services);
const routes = require(config.routes);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

global.config = config;
global._ = require('lodash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function loadControllers(){
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

function bootstrap(){
	loadControllers();
	loadServices();
}


bootstrap();

app.listen(config.port,()=>{
	console.log(`Listening on port ${config.port}`);
})

