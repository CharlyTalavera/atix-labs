module.exports = {
    create: function (req,res) {
        TransactionService.create();

        return res.json({
            status: "Your transaction is being calculated"
        });
    }
}