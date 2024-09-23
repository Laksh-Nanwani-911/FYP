const mongoose = require("mongoose");
const {
  OFFER_STATUS_TYPES_ENUM,
  OFFER_STATUS_TYPES,
} = require("../constants/Basic");

const productRequestOfferSchema = new mongoose.Schema(
  {
    price: { type: Number, required: false, default: 0 },
    description: { type: String, required: true, default: "" },

    status: {
      type: String,
      enum: OFFER_STATUS_TYPES_ENUM,
      required: true,
      default: OFFER_STATUS_TYPES.PENDING,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    productRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductRequest",
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProductRequestOffer",
  productRequestOfferSchema
);
