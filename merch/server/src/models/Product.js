const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["Clothing", "Caps", "Mugs", "Mandala Arts", "Bee Infinity Official T-Shirts", "BOTD T-Shirts"]
    },
    priceINR: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    modelUrl: { type: String, default: "" },
    variants: {
      colors: { type: [String], default: ["Black", "Gold"] },
      sizes: { type: [String], default: ["S", "M", "L"] }
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

