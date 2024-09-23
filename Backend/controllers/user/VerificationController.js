const User = require("../../models/User");
const Otp = require("../../models/Otp");

const { STATUS_CODE, STATUS_MESSAGES } = require("../../constants/Status");
const {
  ERROR_MESSAGES,
  UNAUTHORIZE_MESSAGES,
} = require("../../constants/Errors");

const { SUCCESS_MESSAGES } = require("../../constants/Success");

const { sendVerificationOtpEmail } = require("../../utils/Email");
const { generateOtp } = require("../../utils/Basic");

const { regex } = require("../../utils/Regex");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");

const sendVerificationOtp = async (req, res) => {
  try {
    var { emailAddress } = req.body;

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

      const previousOtpAvailable = await Otp.findOne({
        emailAddress: emailAddress,
      });

      if (previousOtpAvailable) {
        const currentTimestamp = new Date().getTime();
        if (previousOtpAvailable?.expiryAt.getTime() < currentTimestamp) {
          const deletedExpiredOtp = await Otp.findByIdAndDelete(
            previousOtpAvailable._id
          );
          const generatedOtpCode = generateOtp();

          var emailSent = await sendVerificationOtpEmail(
            emailAddress,
            generatedOtpCode
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

      // var emailSent = await sendVerificationOtpEmail(
      //   emailAddress,
      //   generatedOtpCode
      // );

      // if (!emailSent) {
      //   return res
      //     .status(STATUS_CODE.SERVER_ERROR)
      //     .json(
      //       ServerErrorResponse.customError(
      //         STATUS_MESSAGES.FAILED,
      //         STATUS_CODE.SERVER_ERROR,
      //         STATUS_MESSAGES.SOMETHING_WENT_WRONG,
      //         null
      //       )
      //     );
      // }

      var otpObj = new Otp({
        otpCode: generatedOtpCode,
        emailAddress: emailAddress,
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

const verifyRegistrationVerificationOtp = async (req, res) => {
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

      const filter = {
        emailAddress,
      };

      const updatedData = {
        isVerified: true,
      };

      const updatedUser = await User.findOneAndUpdate(filter, updatedData, {
        new: true,
      });

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

module.exports = {
  sendVerificationOtp,
  verifyRegistrationVerificationOtp,
};
