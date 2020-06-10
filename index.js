const fs = require('fs');
const requireDir = require('require-dir');
const config = require('./config/constants.js');
const controllers = requireDir(config.controllers);
const routes = require(config.routes);
const express = require('express');
const app = express();
global._ = require('lodash');

function loadControllers(){
	for (const [route, handler] of Object.entries(routes)){

		const method = route.split(' ').shift().toLowerCase();
		const endpoint = route.split(' ').pop();
		const controller = handler.split('.').shift();
		const func = handler.split('.').pop();
		
		if(_.isUndefined(controllers[controller])){
			console.warn(`Cannot find controller '${controller}' in controllers dir...`);
			continue;
		}

		if(_.isUndefined(controllers[controller][func])){
			console.warn(`Cannot find function '${func}' in controller ${controller}...`);
			continue;
		}

		app[method](endpoint, (controllers[controller][func]));
	}
		
}

loadControllers();

app.listen(config.port,()=>{
	console.log(`Listening on port ${config.port}`);
})

