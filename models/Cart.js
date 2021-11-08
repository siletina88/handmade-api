const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", autopopulate: true },
  quantity: { type: Number, default: 1 },
});
CartItemSchema.plugin(require("mongoose-autopopulate"));

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [CartItemSchema],
    quantity: { type: Number, required: true, default: 0 },
    amount: { type: Number },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

CartSchema.virtual("total", { localField: "amount" }).get(function () {
  return this.products.reduce((acc, product) => {
    if (!product.product.price || !product.quantity) {
      return acc;
    }
    return acc + Number(product.product.price * product.quantity);
  }, 0);
});

CartSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Cart", CartSchema);
