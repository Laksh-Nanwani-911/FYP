const { STATUS_CODE, STATUS_MESSAGES } = require("../../constants/Status");
const { ERROR_MESSAGES } = require("../../constants/Errors");

class ServerErrorResponse {
  constructor(success, code, statusMessage, message, stack) {
    this.success = success;
    this.statusCode = code;
    this.message = message;
    this.statusMessage = statusMessage;
    if (stack) {
      this.stack = stack;
    }
  }
  static badRequest(message) {
    return new ServerErrorResponse(
      false,
      STATUS_CODE.BAD_REQUEST,
      STATUS_MESSAGES.FAILED,
      message
    );
  }
  static internal() {
    return new ServerErrorResponse(
      false,
      STATUS_CODE.SERVER_ERROR,
      STATUS_MESSAGES.SERVER_ERROR
    );
  }
  static notFound(message) {
    return new ServerErrorResponse(
      false,
      STATUS_CODE.NOT_FOUND,
      STATUS_MESSAGES.FAILED,
      message
    );
  }

  static customError(statusMessage, code, message, data) {
    return new ServerErrorResponse(false, code, statusMessage, message, data);
  }

  static customErrorWithStackTrace(code, message, stack) {
    return new ServerErrorResponse(
      false,
      code,
      STATUS_MESSAGES.ERROR,
      message,
      stack
    );
  }
}

module.exports = ServerErrorResponse;
