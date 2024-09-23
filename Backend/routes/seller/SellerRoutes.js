const express = require("express");
const router = express.Router();

const {
  geAllProductsOfSeller,
  deleteSellerProduct,
  updateSellerProduct,
} = require("../../controllers/product/ProductController");

const {
  getSellerDashboardStatistics,
} = require("../../controllers/seller/SellerController");

const {
  authenticateUser,
  validateIsSeller,
} = require("../../middlewares/Auth");

router.get(
  "/get-products",
  authenticateUser,
  validateIsSeller,
  geAllProductsOfSeller
);

router.get(
  "/get-dashboard-statistics",
  authenticateUser,
  validateIsSeller,
  getSellerDashboardStatistics
);

router.delete(
  "/delete-product/:productId",
  authenticateUser,
  validateIsSeller,
  deleteSellerProduct
);

router.put(
  "/update-product/:productId",
  authenticateUser,
  validateIsSeller,
  updateSellerProduct
);

module.exports = router;
