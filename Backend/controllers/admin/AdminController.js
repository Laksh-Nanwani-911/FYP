const User = require("../../models/User");
const Store = require("../../models/Store");
const Product = require("../../models/Product");

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
const { regex } = require("../../utils/Regex");
const bcrypt = require("bcrypt");
const { SUCCESS_MESSAGES } = require("../../constants/Success");
const { generateAuthenticationToken } = require("../../utils/JwtManagement");
const { generateRandomUsername } = require("../../utils/Basic");
const {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} = require("../../utils/Cloudinary");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");

const updateApprovalStatusOfSellerAccount = async (req, res) => {
  try {
    const currentAdminUser = req.adminUser;

    const sellerId = req.params.sellerId;

    const { isApproved, isActive } = req.body;

    if (!sellerId || sellerId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const checkSeller = await User.findOne({
      _id: sellerId,
      role: ROLES.SELLER,
    });

    if (!checkSeller) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.SELLER_NOT_FOUND));
    }

    const filter = {
      _id: checkSeller._id,
    };

    const updatedData = {
      isApproved: isApproved,
      isActive: isActive,
    };

    const updatedUser = await User.findByIdAndUpdate(filter, updatedData, {
      new: true,
    });

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.UPDATE,
          updatedUser
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

const getAllSellers = async (req, res) => {
  try {
    var allSellers = await User.find({
      role: ROLES.SELLER,
    })
      .populate("storeId")
      .select("-password");

    if (!allSellers || allSellers.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.SELLERS_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          allSellers
        )
      );
  } catch (error) {
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const getAdminDashboardStatistics = async (req, res) => {
  try {
    const totalSellers = await User.countDocuments({
      role: ROLES.SELLER,
    });

    const totalApprovedSellers = await User.countDocuments({
      role: ROLES.SELLER,
      isApproved: true,
    });

    const totalActiveSellers = await User.countDocuments({
      role: ROLES.SELLER,
      isActive: true,
    });

    const totalInActiveSellers = await User.countDocuments({
      role: ROLES.SELLER,
      isActive: false,
    });

    const adminDashboardStatistics = {
      totalSellers,
      totalApprovedSellers,
      totalActiveSellers,
      totalInActiveSellers,
    };

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          adminDashboardStatistics
        )
      );
  } catch (error) {
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

const deleteOrRemoveSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.SELLER_NOT_FOUND));
    }

    await Store.findByIdAndDelete(seller.storeId);

    await Product.deleteMany({
      sellerId: seller._id,
    });

    await User.findByIdAndDelete(seller._id);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.DELETE,
          null
        )
      );
  } catch (error) {
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(
        ServerErrorResponse.customErrorWithStackTrace(
          STATUS_CODE.SERVER_ERROR,
          STATUS_MESSAGES.SERVER_ERROR,
          error
        )
      );
  }
};

module.exports = {
  updateApprovalStatusOfSellerAccount,
  getAllSellers,
  getAdminDashboardStatistics,
  deleteOrRemoveSeller,
};
