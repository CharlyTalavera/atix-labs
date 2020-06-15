# Atix labs - Challenge

## Run server
* You can run it with `docker-compose up` if you are familiar with docker.
* or, npm start. (It was develop on Node 12).

## Run tests
* Should run `docker-compose -f docker-compose-test.yml up`.
* or, npm run test. (It was develop on Node 12).

## How it works?
* The program will start a server on port 3000. You can POST to `<url>/transaction` with a attribute `message` in a body, and it will start the process to insert the message (or transaction) into the main block. By design, it will response that the transaction is being calculated. The request will not wait the hash calculation to give a response to the client. There is not reason for that, i think that just is not convenient lock the client waiting for a response.
* As node is a single-thread architecture, the server spawns childrens to calculate the corresponding hash by brute force.
* The process that must handle the transaction persistance is in the main thread. As it run in a unique main thread, before persist the transaction it checks if there is a hash coincidence with the last entry, if not, it have to recalculate the hash. This give us the guarantee that we will not lose the hash continuity.
