const TransactionService = require('../services/TransactionService.js');

process.on("message", function(json){
    let i = 0;
    let hash = "";
    const data = JSON.parse(json);
    console.log(`\n\nCalculating new hash for message ${data.message}`);
    while( !hash.startsWith('00') ){
        hash = TransactionService.hash(data.hash, data.message, i);
        i++;
    }
    process.send(JSON.stringify({
        hash,
        message: data.message,
        nonce: i - 1
    }));

    process.exit();
});