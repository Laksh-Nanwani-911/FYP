const User = require("../../models/User");

const { STATUS_CODE, STATUS_MESSAGES } = require("../../constants/Status");

const {
  ERROR_MESSAGES,
  UNAUTHORIZE_MESSAGES,
} = require("../../constants/Errors");
const { ROLES } = require("../../constants/Roles");
const { regex } = require("../../utils/Regex");
const { SUCCESS_MESSAGES } = require("../../constants/Success");

const bcrypt = require("bcrypt");

const { sendForgotPasswordOtpEmail } = require("../../utils/Email");
const { generateOtp } = require("../../utils/Basic");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");

const checkCurrentPassword = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const currentUser = req.user;

    if (!currentPassword || currentPassword === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    } else {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isPasswordValid) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.FAILED,
              STATUS_CODE.UNAUTHORIZED,
              ERROR_MESSAGES.INCORRECT_CURRENT_PASSWORD,
              null
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
            SUCCESS_MESSAGES.CORRECT_CURRENT_PASSWORD
          )
        );
    }
  } catch (error) {
    res.status(STATUS_CODE.SERVER_ERROR).json(
      ServerErrorResponse.customErrorWithStackTrace(
        STATUS_CODE.SERVER_ERROR,
        STATUS_MESSAGES.SERVER_ERROR,
        {
          stack: error.stack,
          errors: error,
        }
      )
    );
  }
};

const resetPassword = async (req, res) => {
  try {
    var userId = req.user._id;

    if (!userId || userId === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const requiredFields = ["updatedPassword", "updatedConfirmPassword"];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    var { updatedPassword, updatedConfirmPassword } = req.body;

    if (updatedPassword !== updatedConfirmPassword) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(
            "Password and confirm password should be same!"
          )
        );
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json(
          ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND_WITH_ID)
        );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(updatedPassword, saltRounds);

    const filter = {
      _id: user._id,
    };

    const updatedData = {
      password: hashedPassword,
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
          "Password reset successfullY.",
          null
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
  checkCurrentPassword,
  resetPassword,
};
