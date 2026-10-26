const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  const { category, featured } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (featured === "true") filter.isFeatured = true;

  const products = await Product.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();
  res.json({ products });
});

router.get("/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json({ product });
});

module.exports = router;

