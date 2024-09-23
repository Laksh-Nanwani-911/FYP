const User = require("../../models/User");
const Store = require("../../models/Store");
const Otp = require("../../models/Otp");

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
const { generateRandomUsername, generateOtp } = require("../../utils/Basic");
const {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} = require("../../utils/Cloudinary");

const { sendVerificationOtpEmail } = require("../../utils/Email");

const ServerErrorResponse = require("../../utils/classes/ServerErrorResponse");
const ServerSuccessResponse = require("../../utils/classes/ServerSuccessResponse");

const saltRounds = 10;

const loginUser = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    const requiredFields = ["emailAddress", "password"];

    if (requiredFields.some((field) => !req.body[field])) {
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

    const user = await User.findOne({
      emailAddress: emailAddress,
    });

    if (!user) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.NOT_FOUND,
            ERROR_MESSAGES.USER_CREDENTIALS_NOT_FOUND,
            null
          )
        );
    }

    // if (!user.isActive) {
    //   return res
    //     .status(STATUS_CODE.UNAUTHORIZED)
    //     .json(
    //       ServerErrorResponse.customError(
    //         STATUS_MESSAGES.ERROR,
    //         STATUS_CODE.UNAUTHORIZED,
    //         UNAUTHORIZE_MESSAGES.INACTIVE_ACCOUNT,
    //         null
    //       )
    //     );
    // }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.FAILED,
            STATUS_CODE.UNAUTHORIZED,
            ERROR_MESSAGES.INVALID_LOGIN_CREDENTIALS,
            null
          )
        );
    }

    if (user.role === ROLES.SELLER) {
      // seller
      if (!user.isVerified) {
        console.log("email is not verified");

        const generatedOtpCode = generateOtp();

        var otpObj = new Otp({
          otpCode: generatedOtpCode,
          emailAddress: emailAddress,
        });

        const savedOtp = await otpObj.save();

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

        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.NOT_VERIFIED_ACCOUNT,
              null
            )
          );
      } else if (!user.isApproved) {
        console.log("account is not approved from the admin");
        return res.status(STATUS_CODE.UNAUTHORIZED).json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.UNAUTHORIZED,
            UNAUTHORIZE_MESSAGES.UN_APPROVED_ACCOUNT,
            {
              isApproved: false,
            }
          )
        );
      } else if (!user.isActive) {
        console.log("account is deactivated by the admin");
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.INACTIVE_ACCOUNT,
              null
            )
          );
      } else {
        console.log("successful login");
        var tokenPayload = {
          userId: user._id,
          role: user.role,
        };

        const authToken = await generateAuthenticationToken(tokenPayload);
        user.password = null;
        var responseData = {
          user: user,
          authToken: authToken,
        };

        return res
          .status(STATUS_CODE.OK)
          .json(
            ServerSuccessResponse.successResponse(
              true,
              STATUS_MESSAGES.SUCCESS,
              STATUS_CODE.OK,
              SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
              responseData
            )
          );
      }
    } else {
      // customer

      if (!user.isVerified) {
        const generatedOtpCode = generateOtp();

        var otpObj = new Otp({
          otpCode: generatedOtpCode,
          emailAddress: emailAddress,
        });

        const savedOtp = await otpObj.save();

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

        console.log("email is not verified");
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.NOT_VERIFIED_ACCOUNT,
              null
            )
          );
      } else if (!user.isActive) {
        console.log("account is deactivated by the admin");
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.INACTIVE_ACCOUNT,
              null
            )
          );
      } else {
        console.log("successful login");
        var tokenPayload = {
          userId: user._id,
          role: user.role,
        };

        const authToken = await generateAuthenticationToken(tokenPayload);
        user.password = null;
        var responseData = {
          user: user,
          authToken: authToken,
        };

        return res
          .status(STATUS_CODE.OK)
          .json(
            ServerSuccessResponse.successResponse(
              true,
              STATUS_MESSAGES.SUCCESS,
              STATUS_CODE.OK,
              SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
              responseData
            )
          );
      }
    }

    // var tokenPayload = {
    //   userId: user._id,
    //   role: user.role,
    // };

    // const authToken = await generateAuthenticationToken(tokenPayload);
    // user.password = null;
    // var responseData = {
    //   user: user,
    //   authToken: authToken,
    // };

    // return res
    //   .status(STATUS_CODE.OK)
    //   .json(
    //     ServerSuccessResponse.successResponse(
    //       true,
    //       STATUS_MESSAGES.SUCCESS,
    //       STATUS_CODE.OK,
    //       SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
    //       responseData
    //     )
    //   );
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

const registerUser = async (req, res) => {
  try {
    const requiredFields = [
      "firstName",
      "lastName",
      "emailAddress",
      "password",
      "phoneNo",
      "role",
    ];

    if (requiredFields.some((field) => !req.body[field])) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json(
          ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
        );
    }

    const { emailAddress, password, firstName, lastName, role, phoneNo } =
      req.body;

    const userExists = await User.findOne({
      emailAddress: emailAddress,
    });

    if (userExists) {
      return res
        .status(STATUS_CODE.CONFLICT)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.CONFLICT,
            STATUS_CODE.CONFLICT,
            ERROR_MESSAGES.USER_ALREADY_EXISTS("User"),
            null
          )
        );
    }

    if (role === ROLES.SELLER) {
      const requiredFields = [
        "name",
        "storePhoneNo",
        "streetAddress",
        "area",
        "city",
        "zipCode",
      ];

      if (requiredFields.some((field) => !req.body[field])) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json(
            ServerErrorResponse.badRequest(ERROR_MESSAGES.EMPTY_REQUIRED_FIELDS)
          );
      }

      const { name, storePhoneNo, streetAddress, area, city, zipCode } =
        req.body;

      const store = new Store({
        name,
        phoneNo: storePhoneNo,
        streetAddress,
        area,
        city,
        zipCode,
        storeImage: {
          public_id: "",
          url: "",
          isUploaded: false,
        },
      });

      const savedStore = await store.save();

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        phoneNo,
        role,
        profileImage: {
          url: "",
          public_id: "",
          isUploaded: false,
        },

        storeId: savedStore._id,
        isApproved: false,
        isVerified: false,
        isActive: false,
      });

      const savedUser = await user.save();

      const generatedOtpCode = generateOtp();

      var otpObj = new Otp({
        otpCode: generatedOtpCode,
        emailAddress: emailAddress,
      });

      const savedOtp = await otpObj.save();

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

      return res
        .status(STATUS_CODE.CREATED)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.CREATED,
            SUCCESS_MESSAGES.CREATED,
            savedUser
          )
        );
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
        firstName,
        lastName,
        emailAddress,
        password: hashedPassword,
        phoneNo,
        role,
        profileImage: {
          url: "",
          public_id: "",
          isUploaded: false,
        },
        isActive: true,
        isApproved: true,
        isVerified: role === ROLES.SUPER_ADMIN ? true : false,
      });

      const savedUser = await user.save();

      const generatedOtpCode = generateOtp();

      var otpObj = new Otp({
        otpCode: generatedOtpCode,
        emailAddress: emailAddress,
      });

      const savedOtp = await otpObj.save();

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

      return res
        .status(STATUS_CODE.CREATED)
        .json(
          ServerSuccessResponse.successResponse(
            true,
            STATUS_MESSAGES.SUCCESS,
            STATUS_CODE.CREATED,
            SUCCESS_MESSAGES.CREATED,
            savedUser
          )
        );
    }
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
  loginUser,
  registerUser,
};
