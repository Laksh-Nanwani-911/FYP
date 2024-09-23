const express = require("express");
const router = express.Router();

const {
  acceptOrRejectOffer,
  createNewProductRequest,
  getAllProductRequests,
  sendCustomerContactDetails,
  sendOfferForProductRequest,
} = require("../../controllers/productRequest/productRequestController");

const {
  authenticateUser,
  validateIsCustomer,
  validateIsSeller,
} = require("../../middlewares/Auth");

router.post(
  "/create-new-request",
  authenticateUser,
  validateIsCustomer,
  createNewProductRequest
);

router.post(
  "/send-offer/:productRequestId",
  authenticateUser,
  validateIsSeller,
  sendOfferForProductRequest
);

router.get("/get-all-requests", authenticateUser, getAllProductRequests);

router.patch(
  "/accept-or-reject-offer",
  authenticateUser,
  validateIsCustomer,
  acceptOrRejectOffer
);

router.patch(
  "/send-customer-contact-details/:productRequestId",
  authenticateUser,
  validateIsCustomer,
  sendCustomerContactDetails
);

module.exports = router;
