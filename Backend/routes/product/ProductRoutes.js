const express = require("express");
const router = express.Router();

const {
  createNewProduct,
  getAllActiveProducts,
  getAllProducts,
  getSingleProduct,
  createReviewForProduct,
  getSingleProductReviews,
  makeProductAvailableForOffers,
  updateProductReview,
  deleteProductReview,
} = require("../../controllers/product/ProductController");

const bidRouter = require("../bid/bidRoutes");

const {
  authenticateUser,
  validateIsCustomer,
  validateIsSeller,
} = require("../../middlewares/Auth");
const { SUB_BID } = require("../../constants/Routes");

router.post(
  "/create-new-product",
  authenticateUser,
  validateIsSeller,
  createNewProduct
);

router.get("/get-product/:productId", getSingleProduct);

router.get("/get-all-active-products", getAllActiveProducts);

router.get("/get-all-products", authenticateUser, getAllProducts);

router.post(
  "/create-product-review/:productId",
  authenticateUser,
  validateIsCustomer,
  createReviewForProduct
);

router.get(
  "/get-all-reviews/:productId",
  authenticateUser,
  getSingleProductReviews
);

router.patch(
  "/enable-disable-product-offers/:productId",
  authenticateUser,
  validateIsSeller,
  makeProductAvailableForOffers
);

router.put(
  "/update-product-review/:reviewId",
  authenticateUser,
  validateIsCustomer,
  updateProductReview
);

router.delete(
  "/delete-product-review/:reviewId",
  authenticateUser,
  validateIsCustomer,
  deleteProductReview
);

router.use(SUB_BID, bidRouter);

module.exports = router;
