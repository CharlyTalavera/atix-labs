const BASE_DIR = 'hashes/';

module.exports = {
    port: process.env.PORT,
    routes: `${__dirname}/routes.js`,
    path: `${__dirname}/${BASE_DIR}/block.txt`,
    controllers: `./controllers`

}