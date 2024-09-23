const mongoose = require("mongoose");

const productRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "" },
    description: { type: String, required: true, default: "" },

    isApproved: { type: Boolean, required: false, default: false },
    approvedSeller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },

    customerContactDetails: {
      type: Object,
      required: false,
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },

    offers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductRequestOffer",
        default: [],
      },
    ],

    acceptedOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductRequestOffer",
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductRequest", productRequestSchema);
