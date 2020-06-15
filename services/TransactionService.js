const crypto = require('crypto');
FIRST_HASH_VALUE = '0000000000000000000000000000000000000000000000000000000000000000';
FIRST_NONCE = '0';

function create(message) {
    return new Promise( async (resolve, reject) => {
        var child = require('child_process').fork('child/child.js');
        child.on("message", async function(result){
            const data = JSON.parse(result);
            const pushed = await TransactionService.push(data.hash, data.message, data.nonce);
            
            if(!pushed){
                console.log(`Transaction can't be pushed, generating new hash...`);
                return create(message);
            }
            console.log(`Ok, transaction saved.`);
            resolve(data);
        });

        const lastTransaction = await TransactionService.last();

        if(_.isEmpty(lastTransaction.hash)){
            await StorageService.save(`${FIRST_HASH_VALUE},${message},${FIRST_NONCE}`);
            console.log('Saved first transaction.');
            return resolve({
                hash: FIRST_HASH_VALUE,
                message,
                nonce: FIRST_NONCE
            });
        }

        child.send(JSON.stringify({hash:lastTransaction.hash, message}));
    })
}

module.exports = {
    last: async () => {
        const line = (await StorageService.getLastLine()).split(',');
        return {
            hash: line[0],
            message: line[1],
            nonce: line[2]
        }
    },

    push: async function (hash, message, nonce) {
        const prev = (await StorageService.getLastLine()).split(',');

        const lastHash = this.hash(prev[0], message, nonce);
        console.log(`\n\nSaving transaction, cheking if last hash matchs with current... message: ${message}`);
        console.log(hash, lastHash);
        if(hash !== lastHash){
            console.log(`FAILED. Conflict found, last hash doesn't match with current. Other process won us.`);
            return false;
        }
        console.log(`OK. Hashes matches, saving transaction...`);
        await StorageService.save(`${hash},${message},${nonce}`);
        return true;
    },

    create: create,

    hash: (hash, message, nonce) => {
        return crypto.createHash('sha256').update(`${hash},${message},${nonce}`).digest('hex').toString();
    },

    get: () => {
        return StorageService.getAll();
    }
}