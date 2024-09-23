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

const { regex } = require("../../utils/Regex");
const { SUCCESS_MESSAGES } = require("../../constants/Success");
const {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} = require("../../utils/Cloudinary");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");
const Review = require("../../models/Review");

const createNewProduct = async (req, res) => {
  try {
    const sellerUser = req.sellerUser;

    const requiredFields = [
      "title",
      "description",
      "price",
      "quantity",
      "categoryId",
      "images",
    ];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { title, description, price, quantity, images, categoryId } =
      req.body;

    const checkProduct = await Product.findOne({
      title: title,
    });

    if (checkProduct) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.PRODUCT_ALREADY_EXISTS)
        );
    }
    const cloudinaryUploads = await Promise.all(
      images.map(async (base64Image) => {
        return await uploadImageToCloudinary(base64Image);
      })
    );

    const imageDetails = cloudinaryUploads.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    const product = new Product({
      title,
      description,
      price,
      sellerId: sellerUser._id,
      storeId: sellerUser.storeId,
      quantity,
      category: categoryId,
      images: imageDetails,
      isActive: true,
    });

    const savedProduct = await product.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          savedProduct
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

const getAllActiveProducts = async (req, res) => {
  try {
    var allActiveProducts = await Product.find({
      isActive: true,
    })
      .populate("category")
      .populate("storeId")
      .populate("acceptedOffer")
      .populate("offers")

      .populate({
        path: "sellerId",
        select: "firstName lastName emailAddress phoneNo",
      });

    if (!allActiveProducts || allActiveProducts.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCTS_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          allActiveProducts
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

const getAllProducts = async (req, res) => {
  try {
    var allProducts = await Product.find()
      .populate("category")
      .populate("storeId")
      .populate("acceptedOffer")
      .populate("offers")

      .populate({
        path: "sellerId",
        select: "firstName lastName emailAddress phoneNo",
      });

    if (!allProducts || allProducts.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCTS_NOT_FOUND));
    }

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          allProducts
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

const deleteSellerProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const sellerUser = req.sellerUser; // Assuming you have user information stored in req.user after authentication

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
    }

    // Check if the logged-in user is the seller of the product
    if (product.sellerId.toString() !== sellerUser._id.toString()) {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.FORBIDDEN,
            ERROR_MESSAGES.UNAUTHORIZED_DELETE_PRODUCT,
            null
          )
        );
    }

    // If all checks pass, proceed with deleting the product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.DELETE,
          deletedProduct
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

const updateSellerProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const sellerUser = req.sellerUser; // Assuming you have user information stored in req.user after authentication

    if (!productId || productId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const requiredFields = [
      "title",
      "description",
      "isActive",
      "price",
      "quantity",
      "categoryId",
    ];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
    }

    // Check if the logged-in user is the seller of the product
    if (product.sellerId.toString() !== sellerUser._id.toString()) {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.forbidden(
            ERROR_MESSAGES.UNAUTHORIZED_UPDATE_PRODUCT
          )
        );
    }

    // Update product details
    const { title, description, price, quantity, isActive, categoryId } =
      req.body;

    const checkProduct = await Product.findOne({
      title: title,
      _id: { $ne: product._id },
    });

    if (checkProduct) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.PRODUCT_ALREADY_EXISTS)
        );
    }

    // You can add additional validation for the fields if needed

    const filter = {
      _id: product._id,
    };

    const updatedData = {
      title: title || product.title,
      description: description || product.description,
      price: price || product.price,
      quantity: quantity || product.quantity,
      isActive: isActive !== undefined ? isActive : product.isActive,
      category: categoryId || product.category,
    };

    // Save the updated product
    const updatedProduct = await Product.findByIdAndUpdate(
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
          updatedProduct
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

const geAllProductsOfSeller = async (req, res) => {
  try {
    const sellerUser = req.sellerUser;

    const sellerId = sellerUser._id;

    if (!sellerId) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const seller = await User.findOne({
      _id: sellerId,
      role: ROLES.SELLER,
    });
    // Check if the product with the given ID exists
    if (!seller) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.SELLER_NOT_FOUND));
    }

    // Find the product by ID
    const products = await Product.find({
      sellerId: sellerId,
    })
      .populate({
        path: "sellerId",
        select: "firstName lastName emailAddress phoneNo",
      })
      .populate("category")
      .populate("acceptedOffer")
      .populate("offers");

    // Check if the product with the given ID exists
    if (!products || products.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCTS_NOT_FOUND));
    }

    // Return the product details
    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          products
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

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId; // Assuming the product ID is in the request parameters

    // Check if the provided ID is valid (you may want to add more validation)
    if (!productId) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    // Find the product by ID
    const product = await Product.findById(productId)
      .populate("category")
      .populate("storeId")
      .populate({
        path: "sellerId",
        select: "firstName lastName emailAddress phoneNo",
      })
      .populate("acceptedOffer")
      .populate("offers");

    // Check if the product with the given ID exists
    if (!product) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
    }

    // Return the product details
    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          product
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

const createReviewForProduct = async (req, res) => {
  try {
    const customerUser = req.customerUser;
    const productId = req.params.productId;

    const requiredFields = ["description"];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { description, rating } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.PRODUCT_NOT_FOUND));
    }

    const review = new Review({
      description,
      user: customerUser._id,
      rating: rating ? rating : 0,
      product: product._id,
    });

    const savedReview = await review.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          savedReview
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

const getSingleProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    if (!productId) {
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

    const allProductReviews = await Review.find({
      product: product._id,
    }).populate({
      path: "user",
      select: "firstName lastName emailAddress phoneNo",
    });

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.OPERATION_SUCCESSFULL,
          allProductReviews
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

const addOrRemoveProductFromBidding = async (req, res) => {
  try {
    const productId = req.params.productId;
    const sellerUser = req.sellerUser;

    if (!productId || productId === "") {
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

    if (product.sellerId.toString() !== sellerUser._id.toString()) {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.forbidden(
            ERROR_MESSAGES.UNAUTHORIZED_UPDATE_PRODUCT
          )
        );
    }

    const { isAvailbleForBidding } = req.body;

    const filter = {
      _id: product._id,
    };

    const updatedData = {
      isAvailbleForBidding,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
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
          updatedProduct
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

const makeProductAvailableForOffers = async (req, res) => {
  try {
    const productId = req.params.productId;
    const sellerUser = req.sellerUser;

    if (!productId || productId === "") {
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

    if (product.sellerId.toString() !== sellerUser._id.toString()) {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.UNAUTHORIZED_UPDATE_PRODUCT
          )
        );
    }

    const { isAvailbleForBidding, offersDeadline } = req.body;

    const filter = {
      _id: product._id,
    };

    const updatedData = {
      isAvailbleForBidding,
      offersDeadline,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
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
          updatedProduct
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

const updateProductReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const customerUser = req.customerUser;

    if (!reviewId || reviewId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const requiredFields = ["description"];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const reviewExists = await Review.findById(reviewId);
    if (!reviewExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.REVIEW_NOT_FOUND));
    }

    if (reviewExists.user.toString() !== customerUser._id.toString()) {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.forbidden(
            ERROR_MESSAGES.UNAUTHORIZED_UPDATE_REVIEW
          )
        );
    }

    const { description, rating } = req.body;

    const filter = {
      _id: reviewExists._id,
    };

    const updatedData = {
      description,
      rating,
    };

    const updatedReview = await Review.findByIdAndUpdate(filter, updatedData, {
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
          updatedReview
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

const deleteProductReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const customerUser = req.customerUser;

    const reviewExists = await Review.findById(reviewId);
    if (!reviewExists) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.REVIEW_NOT_FOUND));
    }

    if (reviewExists.user.toString() !== customerUser._id.toString()) {
      return res
        .status(STATUS_CODE.FORBIDDEN)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.FORBIDDEN,
            ERROR_MESSAGES.UNAUTHORIZED_DELETE_REVIEW,
            null
          )
        );
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.DELETE,
          deletedReview
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
  createNewProduct,
  getAllActiveProducts,
  getAllProducts,
  deleteSellerProduct,
  updateSellerProduct,
  geAllProductsOfSeller,
  getSingleProduct,
  createReviewForProduct,
  getSingleProductReviews,
  addOrRemoveProductFromBidding,
  makeProductAvailableForOffers,
  updateProductReview,
  deleteProductReview,
};
