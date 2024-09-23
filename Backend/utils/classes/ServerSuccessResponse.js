const { STATUS_CODE, STATUS_MESSAGES } = require("../../constants/Status");
const { ERROR_MESSAGES } = require("../../constants/Errors");

class ServerSuccessResponse {
  constructor(success, code, statusMessage, message, data) {
    this.success = success;
    this.statusCode = code;
    this.message = message;
    this.statusMessage = statusMessage;
    this.data = data;
  }

  static successResponse(success, statusMessage, code, message, data) {
    return new ServerSuccessResponse(
      success,
      code,
      statusMessage,
      message,
      data
    );
  }
}

module.exports = ServerSuccessResponse;
