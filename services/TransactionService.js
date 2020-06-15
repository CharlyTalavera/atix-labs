const crypto = require('crypto');

function create() {
    return new Promise( async (resolve, reject) => {
        var child = require('child_process').fork('child/child.js');
        child.on("message", async function(result){
            const data = JSON.parse(result);
            const pushed = await TransactionService.push(data.hash, data.message, data.nonce);
            
            if(!pushed){
                console.log(`Transaction can't be pushed, generating new hash...`);
                return create();
            }

            resolve(data);
        });

        const lastTransaction = await TransactionService.last();

        child.send(JSON.stringify({hash:lastTransaction.hash, message: 'something'}));
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
        console.log("Checking current calculated hash with last file hash entry");
        const lastHash = this.hash(prev[0], message, nonce);
        console.log(hash, lastHash);
        if(hash !== lastHash){
            console.log(`Conflict found, last hash doesn't match with current. Other process won us.`);
            return false;
        }
        console.log(`Hashes matches, saving transaction...`);
        await StorageService.save(`${hash},${message},${nonce}`);
        return true;
    },

    create: create,

    hash: (hash, message, nonce) => {
        return crypto.createHash('sha256').update(`${hash},${message},${nonce}`).digest('hex').toString();
    }
}