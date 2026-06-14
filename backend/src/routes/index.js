const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const { register, login } = require("../controllers/authController");
const {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");
const { getStats } = require("../controllers/statsController");

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);

// Stats (any logged-in user)
router.get("/stats", protect, getStats);

// Products: reading needs login; writing needs admin
router.get("/products", protect, listProducts);
router.get("/products/:id", protect, getProduct);
router.post("/products", protect, adminOnly, createProduct);
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

module.exports = router;
