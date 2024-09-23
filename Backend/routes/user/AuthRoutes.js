const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
} = require("../../controllers/user/AuthController");

const {
  checkUserEmail,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} = require("../../controllers/user/ForgotPasswordController");

router.post("/login", loginUser);

router.post("/register-user", registerUser);

router.post("/check-user-email", checkUserEmail);

router.post("/send-otp-email", sendForgotPasswordOtp);

router.post("/verify-otp", verifyForgotPasswordOtp);

router.post("/reset-password", resetPassword);

module.exports = router;
