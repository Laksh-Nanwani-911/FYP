const Product = require("../../models/Product");
const User = require("../../models/User");

const {
  STATUS_CODE,
  STATUS_MESSAGES,
  ACCOUNT_STATUS,
} = require("../../constants/Status");

const {
  ERROR_MESSAGES,
  UNAUTHORIZE_MESSAGES,
} = require("../../constants/Errors");
const { ROLES } = require("../../constants/Roles");
const { productTypes } = require("../../constants/Basic");
const {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} = require("../../utils/Cloudinary");

const { regex } = require("../../utils/Regex");

const { SUCCESS_MESSAGES } = require("../../constants/Success");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");

const getSellerDashboardStatistics = async (req, res) => {
  try {
    const sellerUser = req.sellerUser;

    var allProducts = await Product.find({
      sellerId: sellerUser._id,
    }).count();

    const responseData = {
      totalOrders: 0,
      totalProducts: allProducts,
      totalPendingOrders: 0,
    };

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          responseData
        )
      );
  } catch (error) {
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          false,
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error.stack
        )
      );
  }
};

module.exports = {
  getSellerDashboardStatistics,
};
