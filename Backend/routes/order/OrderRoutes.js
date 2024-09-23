const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatistics,
} = require("../../controllers/order/OrderController");

const bidRouter = require("../bid/bidRoutes");

const {
  authenticateUser,
  validateIsCustomer,
  validateIsSeller,
} = require("../../middlewares/Auth");
const { SUB_BID } = require("../../constants/Routes");

router.post("/create-new-order", authenticateUser, createOrder);

router.get("/get-order/:orderId", authenticateUser, getOrderById);

router.get("/get-all-orders", authenticateUser, getAllOrders);
router.get(
  "/get-statistics",
  authenticateUser,
  validateIsSeller,
  getOrderStatistics
);

router.patch(
  "/update-order-status/:orderId",
  authenticateUser,
  updateOrderStatus
);

module.exports = router;
