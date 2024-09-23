const express = require("express");
const router = express.Router();

const {
  createBidForProduct,
  getAllBidsByProductId,
  acceptOrRejectBid,
} = require("../../controllers/bid/bidController");

const {
  authenticateUser,
  validateIsCustomer,
  validateIsSeller,
} = require("../../middlewares/Auth");

router.post(
  "/create-bid/:productId",
  authenticateUser,
  validateIsCustomer,
  createBidForProduct
);

router.get("/get-all-bids/:productId", authenticateUser, getAllBidsByProductId);

router.post(
  "/accept-or-reject-bid",
  authenticateUser,
  validateIsSeller,
  acceptOrRejectBid
);

module.exports = router;
