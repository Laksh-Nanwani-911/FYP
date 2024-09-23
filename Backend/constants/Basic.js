const roles = ["CUSTOMER", "SELLER", "SUPER_ADMIN"];

const OFFER_STATUS_TYPES = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

const OFFER_STATUS_TYPES_ENUM = ["PENDING", "ACCEPTED", "REJECTED"];

const bidStatusTypes = {
  PLACED: "PLACED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

const bidStatusTypesEnum = ["PLACED", "ACCEPTED", "REJECTED"];

const paymentStatusTypes = {
  NOT_PAID: "NOT-PAID",
  PAID: "PAID",
};

const paymentStatusTypesEnum = ["PAID", "NOT-PAID"];

const orderStatusTypesEnum = [
  "PLACED",
  "IN_PROGRESS",
  "PENDING",
  "COMPLETED",
  "DELIVERED",
];

const orderStatusTypes = {
  PLACED: "PLACED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
  DELIVERED: "DELIVERED",
};

var orderStatusTypesArray = [
  {
    title: "Placed",
    value: orderStatusTypes.PLACED,
  },
  {
    title: "Pending",
    value: orderStatusTypes.PENDING,
  },
  {
    title: "Completed",
    value: orderStatusTypes.COMPLETED,
  },
  {
    title: "In Progress",
    value: orderStatusTypes.IN_PROGRESS,
  },
  {
    title: "Delivered",
    value: orderStatusTypes.DELIVERED,
  },
];

var paymentStatusTypesArray = [
  {
    title: "Paid",
    value: paymentStatusTypes.PAID,
  },
  {
    title: "Not Paid",
    value: paymentStatusTypes.NOT_PAID,
  },
];

module.exports = {
  roles,
  OFFER_STATUS_TYPES,
  OFFER_STATUS_TYPES_ENUM,
  bidStatusTypes,
  bidStatusTypesEnum,
  paymentStatusTypesArray,
  orderStatusTypesArray,
  orderStatusTypes,
  paymentStatusTypes,
  orderStatusTypesEnum,
  paymentStatusTypesEnum,
};
