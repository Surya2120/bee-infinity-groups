const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        priceINR: { type: Number, required: true, min: 0 },
        color: { type: String, default: "Black" },
        size: { type: String, default: "M" }
      }
    ],
    billing: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
      address1: { type: String, required: true },
      address2: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" }
    },
    totals: {
      subtotalINR: { type: Number, required: true, min: 0 },
      shippingINR: { type: Number, required: true, min: 0 },
      grandTotalINR: { type: Number, required: true, min: 0 }
    },
    payment: {
      provider: { type: String, default: "placeholder" },
      status: { type: String, default: "pending", enum: ["pending", "paid", "failed"] }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);

