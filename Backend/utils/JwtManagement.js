const jwt = require("jsonwebtoken");

const generateAuthenticationToken = async (payload) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

  return token;
};

module.exports = {
  generateAuthenticationToken,
};
