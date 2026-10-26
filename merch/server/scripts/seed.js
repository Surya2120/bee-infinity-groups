require("dotenv").config();

const mongoose = require("mongoose");
const { connectDb } = require("../src/db");
const Product = require("../src/models/Product");

function slugify(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  await connectDb(uri);

  const products = [
    {
      name: "Bee Infinity Official Tee (Black Gold)",
      category: "Bee Infinity Official T-Shirts",
      priceINR: 899,
      description: "Premium black cotton with gold cinematic print. Built for the showroom.",
      images: ["/images/tee-blackgold.svg"],
      modelUrl: "/models/tshirt.glb",
      variants: { colors: ["Black", "Gold"], sizes: ["S", "M", "L"] },
      isFeatured: true
    },
    {
      name: "BOTD Tee (Noir Edition)",
      category: "BOTD T-Shirts",
      priceINR: 999,
      description: "Noir-grade texture and bold print. A cinematic street silhouette.",
      images: ["/images/botd-tee.svg"],
      modelUrl: "/models/tshirt_botd.glb",
      variants: { colors: ["Black"], sizes: ["S", "M", "L"] }
    },
    {
      name: "Infinity Mug (Obsidian)",
      category: "Mugs",
      priceINR: 449,
      description: "Gloss black ceramic with gold glow crest.",
      images: ["/images/mug-obsidian.svg"],
      modelUrl: "/models/mug.glb",
      variants: { colors: ["Black", "Gold"], sizes: ["One Size"] }
    },
    {
      name: "Golden Hive Cap",
      category: "Caps",
      priceINR: 599,
      description: "Structured cap with gold embroidery. Minimal. High-end.",
      images: ["/images/cap-gold.svg"],
      modelUrl: "/models/cap.glb",
      variants: { colors: ["Black"], sizes: ["One Size"] }
    },
    {
      name: "Mandala Art Print (Gilded)",
      category: "Mandala Arts",
      priceINR: 1299,
      description: "Premium mandala art with metallic gold finish.",
      images: ["/images/mandala-gilded.svg"],
      modelUrl: "",
      variants: { colors: ["Gold"], sizes: ["A4", "A3"] }
    },
    {
      name: "Cinematic Hoodie (Midnight)",
      category: "Clothing",
      priceINR: 1799,
      description: "Midnight heavyweight hoodie with subtle gold accents.",
      images: ["/images/hoodie-midnight.svg"],
      modelUrl: "/models/hoodie.glb",
      variants: { colors: ["Black"], sizes: ["S", "M", "L"] },
      isFeatured: true
    }
  ].map((p) => ({ ...p, slug: p.slug || slugify(p.name) }));

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Seeded ${products.length} products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
