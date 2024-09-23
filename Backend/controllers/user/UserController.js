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

const getUserProfile = async (req, res) => {
  try {
    const currentUser = req.user;
    const userId = currentUser._id;

    if (!userId) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND_WITH_ID)
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
          user
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

const uploadOrUpdateProfileImage = async (req, res) => {
  try {
    var { imageBase64 } = req.body;

    if (!imageBase64 || imageBase64 === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    if (req.user.profileImage.isUploaded) {
      const isDeleted = await deleteImageFromCloudinary(
        req.user.profileImage.public_id
      );

      if (!isDeleted) {
        return res
          .status(STATUS_CODE.SERVER_ERROR)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.FAILED,
              STATUS_CODE.SERVER_ERROR,
              STATUS_MESSAGES.SOMETHING_WENT_WRONG,
              isDeleted
            )
          );
      }

      const uploadedImage = await uploadImageToCloudinary(
        imageBase64,
        "profiles"
      );

      if (!uploadedImage) {
        return res
          .status(STATUS_CODE.SERVER_ERROR)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.FAILED,
              STATUS_CODE.SERVER_ERROR,
              STATUS_MESSAGES.SOMETHING_WENT_WRONG,
              uploadedImage
            )
          );
      }

      var filter = {
        _id: req.user._id,
      };

      var updatedData = {
        profileImage: {
          url: uploadedImage.secure_url,
          public_id: uploadedImage.public_id,
          isUploaded: true,
        },
      };

      const updatedUser = await User.findByIdAndUpdate(filter, updatedData, {
        new: true,
      }).select("-password");

      var responseData = {
        updatedUser: updatedUser,
        updatedProfileImage: updatedUser.profileImage.url,
      };

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            SUCCESS_MESSAGES.UPDATE,
            responseData
          )
        );
    }

    const uploadedImage = await uploadImageToCloudinary(
      imageBase64,
      "profiles"
    );

    if (!uploadedImage) {
      return res
        .status(STATUS_CODE.SERVER_ERROR)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.SERVER_ERROR,
            STATUS_MESSAGES.SOMETHING_WENT_WRONG,
            uploadedImage
          )
        );
    }

    var filter = {
      _id: req.user._id,
    };

    var updatedData = {
      profileImage: {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
        isUploaded: true,
      },
    };

    const updatedUser = await User.findByIdAndUpdate(filter, updatedData, {
      new: true,
    }).select("-password");

    var responseData = {
      updatedUser: updatedUser,
      updatedProfileImage: updatedUser.profileImage.url,
    };

    return res
      .status(STATUS_CODE.OK)
      .json(
        ServerSuccessResponse.successResponse(
          true,
          STATUS_MESSAGES.SUCCESS,
          STATUS_CODE.OK,
          SUCCESS_MESSAGES.UPDATE,
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

const updateUserProfile = async (req, res) => {
  try {
    const currentUser = req.user;

    const requiredFields = ["emailAddress", "firstName", "lastName", "phoneNo"];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { emailAddress, firstName, lastName, phoneNo } = req.body;

    const checkUser = await User.findOne({
      emailAddress: emailAddress,
      _id: { $ne: currentUser._id },
    });

    if (checkUser) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            ERROR_MESSAGES.USER_ALREADY_EXISTS("User")
          )
        );
    }

    const filter = {
      _id: currentUser._id,
    };

    const updatedData = {
      emailAddress,
      firstName,
      lastName,
      phoneNo,
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

module.exports = {
  getUserProfile,
  uploadOrUpdateProfileImage,
  updateUserProfile,
};
