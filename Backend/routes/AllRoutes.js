const express = require("express");
const mainRouter = express.Router();

const {
  USER_AUTH,
  EMAIL,
  PRODUCT,
  CATEGORY,
  USER,
  USER_RESET_PASSWORD,
  SELLER,
  CUSTOMER,
  ADMIN,
  PRODUCT_REQUEST,
  ORDER,
} = require("./../constants/Routes");

const userAuthRouter = require("./../routes/user/AuthRoutes");
const verificationRouter = require("./../routes/user/VerificationRoutes");
const productRouter = require("./../routes/product/ProductRoutes");
const categoryRouter = require("./../routes/category/CategoryRoutes");
const userRouter = require("./../routes/user/UserRoutes");
const userResetPasswordRouter = require("./../routes/user/ResetPasswordRoutes");
const sellerRouter = require("./../routes/seller/SellerRoutes");
const adminRouter = require("./../routes/admin/AdminRoutes");
const productRequestRouter = require("./../routes/productRequest/productRequestRoutes");
const orderRouter = require("./order/OrderRoutes");

mainRouter.use(USER_AUTH, userAuthRouter);
mainRouter.use(EMAIL, verificationRouter);
mainRouter.use(PRODUCT, productRouter);
mainRouter.use(CATEGORY, categoryRouter);
mainRouter.use(USER, userRouter);
mainRouter.use(USER_RESET_PASSWORD, userResetPasswordRouter);
mainRouter.use(SELLER, sellerRouter);
mainRouter.use(ADMIN, adminRouter);
mainRouter.use(PRODUCT_REQUEST, productRequestRouter);
mainRouter.use(ORDER, orderRouter);

module.exports = mainRouter;
