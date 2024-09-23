const express = require("express");
const router = express.Router();

const {
  sendVerificationOtp,
  verifyRegistrationVerificationOtp,
} = require("../../controllers/user/VerificationController");

router.post("/send-verification-email-otp", sendVerificationOtp);

router.post(
  "/verify-registration-verification-otp",
  verifyRegistrationVerificationOtp
);

module.exports = router;
