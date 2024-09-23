const STATUS_CODE = {
  CREATED: 201,
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
  ACCESS_DENIED: 403,
  CONFLICT: 409,
  PRECONDITION_REQUIRED: 428,
};

const STATUS_MESSAGES = {
  SUCCESS: "Success",
  FAILED: "Failed",
  ERROR: "Error",
  SOMETHING_WENT_WRONG: "Something went wrong!",
  SERVER_ERROR: "Internal server error, Something went wrong!",
  CONFLICT: "Conflict",
  PRECONDITION_REQUIRED: "Request Failed",
};

const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

module.exports = {
  STATUS_CODE,
  STATUS_MESSAGES,
  ACCOUNT_STATUS,
};
