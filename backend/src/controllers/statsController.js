const Product = require("../models/Product");
const User = require("../models/User");

// GET /api/stats  -> numbers for the cards + data for the charts
async function getStats(req, res) {
  try {
    const LOW_STOCK = 5;

    const [totalProducts, totalUsers, lowStock, valueAgg, byCategory] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Product.countDocuments({ stock: { $lt: LOW_STOCK } }),
      // total inventory value = sum of price * stock (aggregation pipeline)
      Product.aggregate([
        { $group: { _id: null, value: { $sum: { $multiply: ["$price", "$stock"] } } } },
      ]),
      // products grouped by category -> feeds a bar/pie chart
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { _id: 0, category: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      cards: {
        totalProducts,
        totalUsers,
        lowStock,
        inventoryValue: valueAgg[0]?.value || 0,
      },
      byCategory, // [{ category, count }]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getStats };
