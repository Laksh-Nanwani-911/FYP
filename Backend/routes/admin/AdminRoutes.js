const express = require("express");
const router = express.Router();

const {
  updateApprovalStatusOfSellerAccount,
  getAllSellers,
  getAdminDashboardStatistics,
  deleteOrRemoveSeller,
} = require("../../controllers/admin/AdminController");

const { authenticateUser, validateIsAdmin } = require("../../middlewares/Auth");

router.patch(
  "/change-seller-account-status/:sellerId",
  authenticateUser,
  validateIsAdmin,
  updateApprovalStatusOfSellerAccount
);

router.get(
  "/get-all-sellers",
  authenticateUser,
  validateIsAdmin,
  getAllSellers
);

router.get(
  "/get-dashboard-statistics",
  authenticateUser,
  validateIsAdmin,
  getAdminDashboardStatistics
);

router.delete(
  "/delete-or-remove-seller/:sellerId",
  authenticateUser,
  validateIsAdmin,
  deleteOrRemoveSeller
);

module.exports = router;
