const ERROR_MESSAGES = {
  UNIQUE_EMAIL: "Email address should be unique",
  INVALID_PASSWORD:
    "Password must contain at least 8 characters, including uppercase and lowercase letters",
  EMAIL_REQUIRED: "Email address is required",
  FIRST_NAME_REQUIRED: "First name is required",
  LAST_NAME_REQUIRED: "Last name is required",
  PASSWORD_REQUIRED: "Password is required",
  ROLE_REQUIRED: "Role is required",
  USERNAME_REQUIRED: "Username is required",
  PHONE_NO_REQUIRED: "Phone no is required",

  PASSWORD_REQUIRED: "Password is required",
  INVALID_JWT: `Invalid token! Please Login Again`,
  EXPIRED_JWT: `Your token has expired! please login again`,
  UNAUTHORIZE: "You are not authorize to perform this action",
  IMAGE_REQUIRED: `Image is required`,
  INVALID_LOGIN_CREDENTIALS: "Email or Password is Incorrect",
  INVALID_EMAIL: `Please Enter Valid Email`,
  NOT_FOUND: "Not Found",
  EMPTY_REQUIRED_FIELDS: "Required fields are empty.",
  INVALID_DATA: "Invalid data received.",
  USER_ALREADY_EXISTS: (userType) => {
    return `${userType} already exists with the provided email address`;
  },
  INVALID_OTP: "Invalid OTP Received!",
  USER_CREDENTIALS_NOT_FOUND: "User not found with provided credentials",
  USER_NOT_FOUND_WITH_EMAIL: "User not found with provided email address",
  USER_NOT_FOUND_WITH_ID: "User not found with provided identification number",

  PRODUCTS_NOT_FOUND: "Products not found",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_ALREADY_EXISTS:
    "Product already exists with the provided title and type",

  CATEGORIES_NOT_FOUND: "Categories not found",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_ALREADY_EXISTS: "Category already exists with the provided name",
  ENDPOINT_ACCESS_DENIED: (userType) => {
    return `Forbidden! only ${userType}s are allowed.`;
  },
  INCORRECT_CURRENT_PASSWORD: "Incorrect current password!",
  UNAUTHORIZED_UPDATE_PRODUCT:
    "You're not a authorize seller to update this product",
  UNAUTHORIZED_DELETE_PRODUCT:
    "You're not a authorize seller to delete this product",
  SELLER_NOT_FOUND: "Seller not found",
  SELLERS_NOT_FOUND: "Sellers not found",

  PRODUCT_REQUESTS_NOT_FOUND: "Product requests not found",
  PRODUCT_REQUEST_NOT_FOUND: "Product request not found",

  PRODUCT_REQUEST_OFFERS_NOT_FOUND: "Offers not found",
  PRODUCT_REQUEST_OFFER_NOT_FOUND: "Offer not found",

  BIDS_NOT_FOUND: "Bids not found",
  BID_NOT_FOUND: "Bid not found",
  BID_ALREADY_EXISTS:
    "A bid is already placed that is not accepted nor rejected yet!",

  REVIEWS_NOT_FOUND: "Reviews not found",
  REVIEW_NOT_FOUND: "Review not found",

  UNAUTHORIZED_UPDATE_BID: "You're not a authorize customer to update this bid",
  UNAUTHORIZED_UPDATE_REVIEW:
    "You're not a authorize customer to update this product review",

  UNAUTHORIZED_DELETE_REVIEW:
    "You're not a authorize customer to delete this product review",

  ORDERS_NOT_FOUND: "Orders not found",
  ORDER_NOT_FOUND: "Order not found",
};

const UNAUTHORIZE_MESSAGES = {
  NOT_LOGGED_IN: `You are not logged in please login to get Access`,
  OTP_EXPIRED: "OTP Is Expired.",
  INVALID_JWT: `Invalid token! Please Login Again`,
  EXPIRED_JWT: `Your token has expired! please login again`,
  INVALID_EXPIRED: `Token is invalid or has been Expired`,
  INACTIVE_ACCOUNT: "Your account is deactivated, please contact admin.",
  UN_APPROVED_ACCOUNT:
    "Your account is NOT approved yet by admin, please contact admin.",
  NOT_VERIFIED_ACCOUNT:
    "Your account is NOT verified yet, please verify your account.",
};

module.exports = {
  ERROR_MESSAGES,
  UNAUTHORIZE_MESSAGES,
};
