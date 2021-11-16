const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    products: [
      {
        productId: { type: String },
        quantity: { type: Number, default: 1 },
        size: { type: String },
        color: { type: String },
      },
    ],
    total: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);
OrderSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Order", OrderSchema);
