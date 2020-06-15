const STORAGE_DIR = process.env.STORAGE || 'storage';

module.exports = {
    port: process.env.PORT || 3000,
    routes: `${__dirname}/routes.js`,
    storage_path: `./${STORAGE_DIR}/transactions.txt`,
    storage_service: process.env.STORAGE_SERVICE || 'FileSystem',
    controllers: `./controllers`,
    services: `./services`

}