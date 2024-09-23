const Category = require("../../models/Category");
const ProductRequest = require("../../models/ProductRequest");

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
const { productTypes, OFFER_STATUS_TYPES } = require("../../constants/Basic");

const { regex } = require("../../utils/Regex");
const { SUCCESS_MESSAGES } = require("../../constants/Success");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");
const ProductRequestOffer = require("../../models/ProductRequestOffer");

const createNewProductRequest = async (req, res) => {
  try {
    const currentUser = req.customerUser;

    const requiredFields = ["title", "description"];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { title, description } = req.body;

    const productRequest = new ProductRequest({
      title,
      description,
      isApproved: false,
      approvedSeller: null,
      customerContactDetails: null,
      user: currentUser._id,
    });

    const savedProductRequest = await productRequest.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          savedProductRequest
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

const getAllProductRequests = async (req, res) => {
  try {
    const currentUser = req.user;

    let allProductRequests = [];

    if (currentUser.role === ROLES.CUSTOMER) {
      allProductRequests = await ProductRequest.find({
        user: currentUser._id,
      })
        .populate("user", "firstName lastName emailAddress profileImage")
        .populate({
          path: "offers",
          populate: {
            path: "user",
            select: "firstName lastName emailAddress profileImage",
          },
        })
        .populate("acceptedOffer")
        .populate("approvedSeller")

        .sort({
          updatedAt: -1,
        });
    } else {
      allProductRequests = await ProductRequest.find({
        $or: [
          {
            isApproved: false,
            approvedSeller: null,
          },
          {
            isApproved: true,
            approvedSeller: currentUser._id,
          },
        ],
      })
        .populate("acceptedOffer")
        .populate("approvedSeller")

        .populate("user", "firstName lastName emailAddress profileImage")
        .populate({
          path: "offers",
          populate: {
            path: "user",
            select: "firstName lastName emailAddress profileImage",
          },
        })
        .sort({
          updatedAt: -1,
        });
    }

    if (!allProductRequests || allProductRequests.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(
            ERROR_MESSAGES.PRODUCT_REQUESTS_NOT_FOUND
          )
        );
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          allProductRequests
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

const acceptOrRejectOffer = async (req, res) => {
  try {
    const currentUser = req.customerUser;

    const productRequestId = req.body.productRequestId;
    const productRequestOfferId = req.body.productRequestOfferId;

    if (
      !productRequestId ||
      productRequestId === "" ||
      !productRequestOfferId ||
      productRequestOfferId === ""
    ) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { isApproved, status, sellerId, acceptedOffer } = req.body;

    const productRequest = await ProductRequest.findById(productRequestId);

    if (!productRequest) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_REQUEST_NOT_FOUND)
        );
    }

    const productRequestOffer = await ProductRequestOffer.findById(
      productRequestOfferId
    );

    if (!productRequestOffer) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(
            ERROR_MESSAGES.PRODUCT_REQUEST_OFFER_NOT_FOUND
          )
        );
    }

    const offerFilter = {
      _id: productRequestOffer._id,
    };

    const offerUpdatedupdatedData = {
      status,
    };

    const updatedProductRequestOffer =
      await ProductRequestOffer.findByIdAndUpdate(
        offerFilter,
        offerUpdatedupdatedData,
        {
          new: true,
        }
      );

    const filter = {
      _id: productRequest._id,
    };

    const updatedData = {
      isApproved,
      approvedSeller: sellerId,
      acceptedOffer:
        status === OFFER_STATUS_TYPES.ACCEPTED ? productRequestOffer._id : null,
    };

    const updatedProductRequest = await ProductRequest.findByIdAndUpdate(
      filter,
      updatedData,
      {
        new: true,
      }
    );

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.UPDATE,
          updatedProductRequest
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

const sendOfferForProductRequest = async (req, res) => {
  try {
    const currentUser = req.sellerUser;

    const productRequestId = req.params.productRequestId;

    if (!productRequestId || productRequestId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { description, price } = req.body;

    const productRequest = await ProductRequest.findById(productRequestId);

    if (!productRequest) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_REQUEST_NOT_FOUND)
        );
    }

    const offerExists = await ProductRequestOffer.findOne({
      user: currentUser._id,
      status: OFFER_STATUS_TYPES.PENDING,
      productRequest: productRequest._id,
    });

    if (offerExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.badRequest(
            "Offer is already created that is not accepted or rejected yet!"
          )
        );
    }

    const offer = new ProductRequestOffer({
      price,
      description,
      user: currentUser._id,
      status: OFFER_STATUS_TYPES.PENDING,
      productRequest: productRequest._id,
    });

    const savedOffer = await offer.save();

    const filter = {
      _id: productRequest._id,
    };

    const updatedData = {
      $push: { offers: savedOffer._id },
    };

    const updatedProductRequest = await ProductRequest.findByIdAndUpdate(
      filter,
      updatedData,
      {
        new: true,
      }
    );

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OFFER_SENT_SUCCESS,
          savedOffer
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

const sendCustomerContactDetails = async (req, res) => {
  try {
    const currentUser = req.customerUser;

    const productRequestId = req.params.productRequestId;

    if (!productRequestId || productRequestId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { customerContactDetails } = req.body;

    const productRequest = await ProductRequest.findById(productRequestId);

    if (!productRequest) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_REQUEST_NOT_FOUND)
        );
    }

    const filter = {
      _id: productRequest._id,
    };

    const updatedData = {
      customerContactDetails,
    };

    const updatedProductRequest = await ProductRequest.findByIdAndUpdate(
      filter,
      updatedData,
      {
        new: true,
      }
    );

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.UPDATE,
          updatedProductRequest
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
  createNewProductRequest,
  acceptOrRejectOffer,
  getAllProductRequests,
  sendCustomerContactDetails,
  sendOfferForProductRequest,
};
