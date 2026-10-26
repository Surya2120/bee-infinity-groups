const express = require("express");
const { z } = require("zod");
const { authRequired } = require("../middleware/auth");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1),
        color: z.string().optional(),
        size: z.string().optional()
      })
    )
    .min(1),
  billing: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional().default(""),
    address1: z.string().min(2),
    address2: z.string().optional().default(""),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().optional().default("India")
  }),
  paymentProvider: z.string().optional().default("placeholder")
});

router.post("/", authRequired, async (req, res) => {
  const parsed = CreateOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });

  const { items, billing, paymentProvider } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true }).lean();
  const byId = new Map(products.map((p) => [String(p._id), p]));

  const enriched = [];
  for (const item of items) {
    const p = byId.get(item.productId);
    if (!p) return res.status(400).json({ error: "Invalid product in cart" });
    enriched.push({
      productId: p._id,
      name: p.name,
      slug: p.slug,
      qty: item.qty,
      priceINR: p.priceINR,
      color: item.color || "Black",
      size: item.size || "M"
    });
  }

  const subtotalINR = enriched.reduce((sum, i) => sum + i.qty * i.priceINR, 0);
  const shippingINR = subtotalINR >= 1999 ? 0 : 99;
  const grandTotalINR = subtotalINR + shippingINR;

  const order = await Order.create({
    userId: req.user.sub,
    items: enriched,
    billing,
    totals: { subtotalINR, shippingINR, grandTotalINR },
    payment: { provider: paymentProvider, status: "pending" }
  });

  res.status(201).json({ orderId: String(order._id) });
});

router.get("/mine", authRequired, async (req, res) => {
  const orders = await Order.find({ userId: req.user.sub }).sort({ createdAt: -1 }).lean();
  res.json({ orders });
});

module.exports = router;

