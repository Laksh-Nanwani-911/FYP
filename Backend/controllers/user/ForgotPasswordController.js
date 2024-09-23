const User = require("../../models/User");
const Otp = require("../../models/Otp");

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

const checkUserEmail = async (req, res) => {
  try {
    const { emailAddress } = req.body;

    if (!emailAddress || emailAddress === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    } else {
      var isValidEmail = regex.email.test(emailAddress);

      if (!isValidEmail) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
      }

      const searchedUser = await User.findOne({
        emailAddress: emailAddress,
      }).select("emailAddress");

      if (!searchedUser) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json(
            ServerErrorResponse.notFound(
              ERROR_MESSAGES.USER_NOT_FOUND_WITH_EMAIL
            )
          );
      } else {
        return res
          .status(STATUS_CODE.OK)
          .json(
            ServerSuccessResponse.successResponse(
              true,
              STATUS_MESSAGES.SUCCESS,
              STATUS_CODE.OK,
              "User found with provided email address.",
              searchedUser
            )
          );
      }
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

const sendForgotPasswordOtp = async (req, res) => {
  try {
    var { emailAddress, userId } = req.body;

    if (!emailAddress || emailAddress === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    } else {
      var isValidEmail = regex.email.test(emailAddress);

      if (!isValidEmail) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
      }

      const searchedUser = await User.findOne({
        _id: userId,
      });

      if (!searchedUser) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json(
            ServerErrorResponse.notFound(ERROR_MESSAGES.USER_NOT_FOUND_WITH_ID)
          );
      }

      const previousOtpAvailable = await Otp.findOne({
        user: userId,
        emailAddress: emailAddress,
      });

      if (previousOtpAvailable) {
        const currentTimestamp = new Date().getTime();
        if (previousOtpAvailable?.expiryAt.getTime() < currentTimestamp) {
          const deletedExpiredOtp = await Otp.findByIdAndDelete(
            previousOtpAvailable._id
          );
          const generatedOtpCode = generateOtp();

          var emailSent = await sendForgotPasswordOtpEmail(
            emailAddress,
            generatedOtpCode,
            "User"
          );

          if (!emailSent) {
            return res
              .status(STATUS_CODE.SERVER_ERROR)
              .json(
                ServerErrorResponse.customError(
                  STATUS_MESSAGES.FAILED,
                  STATUS_CODE.SERVER_ERROR,
                  STATUS_MESSAGES.SOMETHING_WENT_WRONG,
                  null
                )
              );
          }

          var otpObj = new Otp({
            otpCode: generatedOtpCode,
            emailAddress: emailAddress,
            user: userId,
          });

          const savedOtp = await otpObj.save();

          return res
            .status(STATUS_CODE.OK)
            .json(
              ServerSuccessResponse.successResponse(
                true,
                STATUS_MESSAGES.SUCCESS,
                STATUS_CODE.OK,
                SUCCESS_MESSAGES.OTP_SENT_SUCCESS,
                null
              )
            );
        } else {
          return res
            .status(STATUS_CODE.OK)
            .json(
              ServerSuccessResponse.successResponse(
                true,
                STATUS_MESSAGES.SUCCESS,
                STATUS_CODE.OK,
                "A previous OTP exists and is not expired yet.",
                null
              )
            );
        }
      }

      const generatedOtpCode = generateOtp();

      var emailSent = await sendForgotPasswordOtpEmail(
        emailAddress,
        generatedOtpCode,
        "User"
      );

      if (!emailSent) {
        return res
          .status(STATUS_CODE.SERVER_ERROR)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.FAILED,
              STATUS_CODE.SERVER_ERROR,
              STATUS_MESSAGES.SOMETHING_WENT_WRONG,
              null
            )
          );
      }

      var otpObj = new Otp({
        otpCode: generatedOtpCode,
        emailAddress: emailAddress,
        user: userId,
      });

      const savedOtp = await otpObj.save();

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            "OTP Sent Successfully!.",
            null
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

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { emailAddress, otpCode } = req.body;

    if (!emailAddress || emailAddress === "" || !otpCode || otpCode === "") {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    var isValidEmail = regex.email.test(emailAddress);

    if (!isValidEmail) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_EMAIL));
    }

    const otpEntry = await Otp.findOne({
      emailAddress: emailAddress,
      otpCode: otpCode,
    });

    if (!otpEntry) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(ServerErrorResponse.badRequest(ERROR_MESSAGES.INVALID_OTP));
    }

    const currentTimestamp = new Date().getTime();
    if (otpEntry.expiryAt.getTime() < currentTimestamp) {
      await Otp.findByIdAndDelete(otpEntry._id);
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.UNAUTHORIZED,
            UNAUTHORIZE_MESSAGES.OTP_EXPIRED,
            null
          )
        );
    }

    const perfectOtp = await Otp.findByIdAndDelete(otpEntry._id);

    let condition =
      perfectOtp.emailAddress === emailAddress &&
      perfectOtp.otpCode === otpCode;

    if (
      perfectOtp.emailAddress === emailAddress &&
      perfectOtp.otpCode === otpCode
    ) {
      await Otp.findByIdAndDelete(perfectOtp._id);

      return res
        .status(STATUS_CODE.OK)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.OK,
            "OTP Verified Successfully.",
            null
          )
        );
    } else {
      console.log("notnotnotnotokokokok");
    }
  } catch (error) {
    console.log(error);
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
    var userId = req.body.userId;

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
  checkUserEmail,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
};
