require("dotenv").config();

const { createApp } = require("./app");
const { connectDb } = require("./db");

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI (set it in server/.env)");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET (set it in server/.env)");
  }

  await connectDb(MONGODB_URI);
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

