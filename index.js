const config = require('./config/constants.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bootstrap = require('./bootstrap');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

bootstrap(app);

app.listen(config.port,()=>{
	console.log(`Listening on port ${config.port}`);
})
