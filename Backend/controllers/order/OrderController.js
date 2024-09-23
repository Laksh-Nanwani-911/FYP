const Product = require("../../models/Product");
const User = require("../../models/User");
const Order = require("../../models/Order");

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
const { SUCCESS_MESSAGES } = require("../../constants/Success");
const {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} = require("../../utils/Cloudinary");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");
const Review = require("../../models/Review");
const {
  orderStatusTypes,
  paymentStatusTypes,
} = require("../../constants/Basic");

const createOrder = async (req, res) => {
  try {
    const { shippingDetails, items, seller, customer, quantity, totalAmount } =
      req.body;

    let order = new Order({
      completed: false,
      customer,
      items,
      orderStatus: orderStatusTypes.PLACED,
      seller,
      shippingDetails,
      totalAmount,
      paymentMode: "COD",
      paymentStatus: paymentStatusTypes.NOT_PAID,
    });

    const savedOrder = await order.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.CREATED,
          savedOrder
        )
      );
  } catch (error) {
    return res
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

const getAllOrders = async (req, res) => {
  try {
    const currentUser = req.user;
    let allOrders = [];
    if (currentUser.role === ROLES.CUSTOMER) {
      // customer
      allOrders = await Order.find({
        customer: currentUser._id,
      })
        .populate("seller", "firstName lastName _id")
        .populate("items.item");
    } else if (currentUser.role === ROLES.SELLER) {
      // seller
      allOrders = await Order.find({
        seller: currentUser._id,
      })
        .populate("customer", "firstName lastName _id")
        .populate("items.item");
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          allOrders
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

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("seller", "firstName lastName _id")
      .populate("customer", "firstName lastName _id")

      .populate("items.item");

    if (!order) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.ORDER_NOT_FOUND));
    }
    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          order
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

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    if (!orderId || orderId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.ORDER_NOT_FOUND));
    }

    const { status } = req.body;

    const filter = {
      _id: order._id,
    };

    const updatedData = {
      orderStatus: status,
    };

    const updatedOrder = await Order.findByIdAndUpdate(filter, updatedData, {
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
          updatedOrder
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

const getOrderStatistics = async (req, res) => {
  try {
    const currentUser = req.sellerUser;

    const totalOrders = await Order.countDocuments({
      seller: currentUser._id,
    });
    const totalInProgressOrders = await Order.countDocuments({
      seller: currentUser._id,
      orderStatus: orderStatusTypes.IN_PROGRESS,
    });
    const totalDeliveredOrders = await Order.countDocuments({
      seller: currentUser._id,
      orderStatus: orderStatusTypes.DELIVERED,
    });
    const totalPlacedOrders = await Order.countDocuments({
      seller: currentUser._id,
      orderStatus: orderStatusTypes.PLACED,
    });
    const orderStatistics = {
      totalOrders,
      totalPlacedOrders,
      totalInProgressOrders,
      totalDeliveredOrders,
    };
    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          orderStatistics
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
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStatistics,
};
