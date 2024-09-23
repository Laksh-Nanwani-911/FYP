const jwt = require("jsonwebtoken");

const ServerErrorResponse = require("../utils/classes/ServerErrorResponse");
const {
  STATUS_CODE,
  STATUS_MESSAGES,
  ACCOUNT_STATUS,
} = require("../constants/Status");
const { ERROR_MESSAGES, UNAUTHORIZE_MESSAGES } = require("../constants/Errors");
const { ROLES } = require("../constants/Roles");

const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  //getting token and check is it there

  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.NOT_LOGGED_IN,
              null
            )
          )
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded.userId);

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTimestamp) {
      return next(
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.EXPIRED_JWT,
              null
            )
          )
      );
    }

    if (!currentUser) {
      return next(
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              ERROR_MESSAGES.NOT_FOUND,
              null
            )
          )
      );
    }

    if (currentUser.role === ROLES.SELLER) {
      // seller
      if (!currentUser.isVerified) {
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
      } else if (!currentUser.isApproved) {
        console.log("account is not approved from the admin");
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.UNAUTHORIZED,
              UNAUTHORIZE_MESSAGES.UN_APPROVED_ACCOUNT,
              null
            )
          );
      } else if (!currentUser.isActive) {
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
        req.user = currentUser;
        req.tokenPayload = decoded;
        next();
      }
    } else {
      // customer

      if (!currentUser.isVerified) {
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
      } else if (!currentUser.isActive) {
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
        req.user = currentUser;
        req.tokenPayload = decoded;
        next();
      }
    }

    // req.user = currentUser;
    // req.tokenPayload = decoded;
    // next();
  } catch (error) {
    const obj = {
      expired: true,
    };
    return next(
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.UNAUTHORIZED,
            UNAUTHORIZE_MESSAGES.EXPIRED_JWT,
            obj
          )
        )
    );
  }
};

const validateIsSeller = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser && currentUser.role === ROLES.SELLER) {
      req.sellerUser = currentUser;
      next();
    } else {
      return next(
        res
          .status(STATUS_CODE.ACCESS_DENIED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.ACCESS_DENIED,
              ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.SELLER),
              null
            )
          )
      );
    }
  } catch (error) {
    const errorResponseData = {
      error,
    };
    return next(
      res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.ACCESS_DENIED,
            UNAUTHORIZE_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.SELLER),
            errorResponseData
          )
        )
    );
  }
};

const validateIsCustomer = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser && currentUser.role === ROLES.CUSTOMER) {
      req.customerUser = currentUser;
      next();
    } else {
      return next(
        res
          .status(STATUS_CODE.ACCESS_DENIED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.ACCESS_DENIED,
              ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.CUSTOMER),
              null
            )
          )
      );
    }
  } catch (error) {
    const errorResponseData = {
      error,
    };
    return next(
      res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.ACCESS_DENIED,
            UNAUTHORIZE_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.CUSTOMER),
            errorResponseData
          )
        )
    );
  }
};

const validateIsAdmin = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser && currentUser.role === ROLES.SUPER_ADMIN) {
      req.adminUser = currentUser;
      next();
    } else {
      return next(
        res
          .status(STATUS_CODE.ACCESS_DENIED)
          .json(
            ServerErrorResponse.customError(
              STATUS_MESSAGES.ERROR,
              STATUS_CODE.ACCESS_DENIED,
              ERROR_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.SUPER_ADMIN),
              null
            )
          )
      );
    }
  } catch (error) {
    const errorResponseData = {
      error,
    };
    return next(
      res
        .status(STATUS_CODE.ACCESS_DENIED)
        .json(
          ServerErrorResponse.customError(
            STATUS_MESSAGES.ERROR,
            STATUS_CODE.ACCESS_DENIED,
            UNAUTHORIZE_MESSAGES.ENDPOINT_ACCESS_DENIED(ROLES.CUSTOMER),
            errorResponseData
          )
        )
    );
  }
};

module.exports = {
  authenticateUser,
  validateIsCustomer,
  validateIsSeller,
  validateIsAdmin,
};
