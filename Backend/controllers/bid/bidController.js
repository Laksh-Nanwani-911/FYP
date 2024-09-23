const { bidStatusTypes } = require("../../constants/Basic");
const { ERROR_MESSAGES } = require("../../constants/Errors");
const { ROLES } = require("../../constants/Roles");
const { STATUS_CODE, STATUS_MESSAGES } = require("../../constants/Status");
const { SUCCESS_MESSAGES } = require("../../constants/Success");
const Bid = require("../../models/Bid");
const Product = require("../../models/Product");
const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");

const createBidForProduct = async (req, res) => {
  try {
    const currentUser = req.customerUser;

    const productId = req.params.productId;

    if (!productId || productId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
    }

    console.log(currentUser._id);

    const bidExists = await Bid.findOne({
      user: currentUser._id,
      status: bidStatusTypes.PLACED,
      product: productExists._id,
    });

    console.log(bidExists);

    if (bidExists) {
      return res
        .status(STATUS_CODE.CONFLICT)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.CONFLICT,
            STATUS_CODE.CONFLICT,
            ERROR_MESSAGES.BID_ALREADY_EXISTS,
            null
          )
        );
    }

    const { bidFare, notesOrInstruction } = req.body;

    const bid = new Bid({
      bidFare,
      notesOrInstruction,
      status: bidStatusTypes.PLACED,
      user: currentUser._id,
      product: productExists._id,
    });

    const savedBid = await bid.save();

    await Product.findByIdAndUpdate(
      { _id: productExists._id },
      {
        $push: { offers: savedBid._id },
      },
      {
        new: true,
      }
    );

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          savedBid
        )
      );
  } catch (error) {
    res
      .status(STATUS_CODE.SERVER_ERROR)
      .json(ServerErrorResponse.internal(error));
  }
};

const getAllBidsByProductId = async (req, res) => {
  try {
    const currentUser = req.user;

    const productId = req.params.productId;

    if (!productId || productId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
    }

    const query =
      currentUser.role === ROLES.SELLER
        ? { product: productExists._id }
        : { product: productExists._id, user: currentUser._id };

    var allBidsOfProduct = await Bid.find(query)
      .populate(
        "user",
        "firstName lastName profileImage _id phoneNo emailAddress"
      )
      .sort({
        createdAt: -1,
      });

    if (!allBidsOfProduct || allBidsOfProduct.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.BIDS_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          allBidsOfProduct
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

const acceptOrRejectBid = async (req, res) => {
  // try {
  const productId = req.body.productId;
  const bidId = req.body.bidId;

  const customerUser = req.sellerUser;

  if (!productId || productId === "" || !bidId || bidId === "") {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json(
        ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
      );
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
  }

  const bidInstance = await Bid.findById(bidId);
  if (!bidInstance) {
    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json(ServerErrorResponse.notFound(ERROR_MESSAGES.BID_NOT_FOUND));
  }

  const { status } = req.body;

  const filter = {
    _id: bidInstance._id,
  };

  const updatedData = {
    status,
  };

  const updatedBid = await Bid.findByIdAndUpdate(filter, updatedData, {
    new: true,
  });

  if (status === bidStatusTypes.ACCEPTED) {
    const filterProduct = {
      _id: product._id,
    };

    const updatedDataProduct = {
      acceptedOffer: bidInstance._id,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      filterProduct,
      updatedDataProduct,
      {
        new: true,
      }
    );

    await Bid.updateMany(
      {
        _id: { $ne: bidInstance._id },
        product: product._id,
        status: bidStatusTypes.PLACED,
      },
      { status: bidStatusTypes.REJECTED }
    );
  } else if (status === bidStatusTypes.REJECTED) {
    // await Product.findByIdAndUpdate(
    //   { _id: product._id },
    //   {
    //     $pull: {
    //       offers: bidInstance._id,
    //     },
    //   },
    //   {
    //     new: true,
    //   }
    // ); 
  }

  return res
    .status(STATUS_CODE.OK)
    .json(
      ServerSuccessResponse.successResponse(
        true,
        STATUS_MESSAGES.SUCCESS,
        STATUS_CODE.OK,
        status === bidStatusTypes.ACCEPTED
          ? SUCCESS_MESSAGES.BID_ACCEPTED
          : SUCCESS_MESSAGES.BID_REJECTED,
        null
      )
    );
  // } catch (error) {
  //   res
  //     .status(STATUS_CODE.SERVER_ERROR)
  //     .json(
  //       ServerErrorResponse.customErrorWithStackTrace(
  //         STATUS_CODE.SERVER_ERROR,
  //         STATUS_MESSAGES.SERVER_ERROR,
  //         error
  //       )
  //     );
  // }
};

module.exports = {
  createBidForProduct,
  getAllBidsByProductId,
  acceptOrRejectBid,
};
