const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    default: "",
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Seller id is required"],
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "Store id is required"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  // category: {
  //   type: String,
  //   required: [true, "Product category is required"],
  //   default: "",
  // },
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
  quantity: {
    type: Number,
    required: false,
    default: 0,
  },
  images: [
    {
      url: {
        type: String,
        required: false,
        default: "",
      },
      publicId: {
        type: String,
        required: false,
        default: "",
      },
    },
  ],
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  },
  isAvailbleForBidding: {
    type: Boolean,
    required: false,
    default: false,
  },

  offersDeadline: {
    type: Date,
    required: false,
    default: null,
  },

  acceptedOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bid",
    required: false,
    default: null,
  },

  offers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      required: false,
    },
  ],
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
