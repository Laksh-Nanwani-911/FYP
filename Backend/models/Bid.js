const mongoose = require("mongoose");
const { bidStatusTypesEnum, bidStatusTypes } = require("../constants/Basic");

const bidSchema = new mongoose.Schema(
  {
    notesOrInstruction: { type: String, required: true },

    bidFare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: bidStatusTypesEnum,
      default: bidStatusTypes.PLACED,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bid", bidSchema);
