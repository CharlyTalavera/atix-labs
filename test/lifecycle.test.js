const bootstrap = require('../bootstrap');
const express = require('express');
const dummyApp = express();

bootstrap(dummyApp);

before(function (done) {
    console.log = () => {};
    done();
});

beforeEach(function(done){
    StorageService.clean();
    done();
})

after(function (done){
    done();
})

