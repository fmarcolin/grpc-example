const Purchase = require('./models/Purchase');

module.exports = {
    async purchase(call, callback) {
        const { title, value, userId } = call.request.purchase;

        const purchase = await Purchase.create({ title, value, userId });

        purchase.id = purchase._id;

        return callback(null, { purchase });
    },

    async getPurchaseById(call, callback) {
        const { id } = call.request;

        const purchase = await Purchase.findById(id);

        purchase.id = purchase._id;

        return callback(null, { purchase });
    },

    async listAllPurchasesFromUser(call, callback) {
        const { userId } = call.request;

        const purchases = await Purchase.find({ userId });

        return callback(null, { purchases });
    },
}