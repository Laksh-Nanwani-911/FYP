const express = require("express");
const router = express.Router();

const {
  checkCurrentPassword,
  resetPassword,
} = require("../../controllers/user/ResetPasswordController");

const { authenticateUser } = require("../../middlewares/Auth");

router.post(
  "/validate-current-password",
  authenticateUser,
  checkCurrentPassword
);

router.patch("/update-password", authenticateUser, resetPassword);

module.exports = router;
