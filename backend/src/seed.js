require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/admin_dashboard";

const categories = ["Electronics", "Clothing", "Home", "Books", "Toys"];
const sampleProducts = Array.from({ length: 30 }).map((_, i) => ({
  name: `Product ${i + 1}`,
  category: categories[i % categories.length],
  price: Math.floor(Math.random() * 200) + 10,
  stock: Math.floor(Math.random() * 20),
}));

(async () => {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await Product.deleteMany({});

  // create() triggers the pre-save hash, so the password is stored hashed
  await User.create({ name: "Demo Admin", email: "admin@demo.com", password: "admin123", role: "admin" });
  await Product.insertMany(sampleProducts);

  console.log("Seeded. Login with admin@demo.com / admin123");
  await mongoose.disconnect();
})();
