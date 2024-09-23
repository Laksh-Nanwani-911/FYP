const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otpCode: { type: String, required: true },

  emailAddress: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  expiryAt: {
    type: Date,
    default: () => new Date(Date.now() + 1 * 120 * 1000), // Set to 2 minutes from now
  },
});

otpSchema.index({ expiryAt: 1 }, { expireAfterSeconds: 120 });

module.exports = mongoose.model("Otp", otpSchema);
