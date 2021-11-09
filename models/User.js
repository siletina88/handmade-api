const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    isAdmin: { type: Boolean, default: false },
    img: { type: String },
    fullName: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    phone: { type: String, default: "" },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", autopopulate: true },
  },
  { timestamps: true }
);
UserSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("User", UserSchema);
