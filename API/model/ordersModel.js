const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ordersSchema = new schema({
  userId: mongoose.Types.ObjectId,
  productId: [mongoose.Types.ObjectId],
  orderDate: {
    type: Date,
    default: new Date(),
  },
});

const ordersModel = mongoose.model("orders", ordersSchema);

module.exports = ordersModel;
