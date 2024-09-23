const Category = require("../../models/Category");

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

const { regex } = require("../../utils/Regex");
const { SUCCESS_MESSAGES } = require("../../constants/Success");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");

const createNewCategory = async (req, res) => {
  try {
    const requiredFields = ["name", "isActive"];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { name, isActive } = req.body;

    const checkCategory = await Category.findOne({
      name: name,
    });

    if (checkCategory) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.CATEGORY_ALREADY_EXISTS)
        );
    }
    const category = new Category({
      name,

      isActive,
    });

    const savedCategory = await category.save();

    return res
      .status(STATUS_CODE.CREATED)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.CREATED,
          SUCCESS_MESSAGES.CREATED,
          savedCategory
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

const getAllActiveCategories = async (req, res) => {
  try {
    var allActiveCategories = await Category.find({
      isActive: true,
    });

    if (!allActiveCategories || allActiveCategories.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.CATEGORIES_NOT_FOUND)
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
          allActiveCategories
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

const getAllCategories = async (req, res) => {
  try {
    var allCategories = await Category.find();

    if (!allCategories || allCategories.length <= 0) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.CATEGORIES_NOT_FOUND)
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
          allCategories
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

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId || categoryId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.CATEGORY_NOT_FOUND));
    }

    // Perform the delete operation
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.DELETE,
          deletedCategory
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

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId || categoryId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const requiredFields = ["name", "isActive"];
    const { name, isActive } = req.body;

    if (!name || name === "") {
      console.log("dfkj");
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(ServerErrorResponse.notFound(ERROR_MESSAGES.CATEGORY_NOT_FOUND));
    }

    const filter = {
      _id: category._id,
    };

    const updatedData = {
      name: name,
      isActive: isActive,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
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
          updatedCategory
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
  createNewCategory,
  getAllActiveCategories,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
