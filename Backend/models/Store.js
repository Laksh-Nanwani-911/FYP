const mongoose = require("mongoose");

const { roles } = require("../constants/Basic");
const { ERROR_MESSAGES } = require("../constants/Errors");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: "",
    },
    phoneNo: {
      type: String,
      required: [true, ERROR_MESSAGES.PHONE_NO_REQUIRED],
      default: "",
    },
    streetAddress: {
      type: String,
      required: false,
      default: "",
    },
    area: {
      type: String,
      required: false,
      default: "",
    },
    city: {
      type: String,
      required: false,
      default: "",
    },
    zipCode: {
      type: String,
      required: false,
      default: "",
    },

    storeImage: {
      url: {
        type: String,
        required: false,
        default: "",
      },
      public_id: {
        type: String,
        required: false,
        default: "",
      },
      isUploaded: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const storeModel = mongoose.model("Store", storeSchema);

module.exports = storeModel;
