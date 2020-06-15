module.exports = {
    create: function (req,res) {
        if(!req.body.message)
            return res.status(400).json({
                msg: `Can not save a transaction with an empty message.`
            })

        console.log(`\n\nReceived new transaction with message ${ req.body.message}`);
        TransactionService.create(req.body.message);

        return res.json({
            status: "Your transaction is being calculated"
        });
    },

    get: (req, res) => {
        return res.json(TransactionService.get());
    }
}