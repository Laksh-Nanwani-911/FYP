const mongoose = require("mongoose");

const {
  paymentStatusTypesEnum,
  orderStatusTypesEnum,
} = require("../constants/Basic");

const orderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    completed: { type: Boolean, default: false },
    orderStatus: {
      type: String,
      required: false,
      enum: orderStatusTypesEnum,
      default: "PLACED",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: false,
      enum: paymentStatusTypesEnum,
      default: "NOT-PAID",
    },
    paymentMode: {
      type: String,
      required: false,
      default: "COD",
    },
    shippingDetails: {
      address: { type: String },
      country: { type: String, default: null },
      city: { type: String, default: null },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
