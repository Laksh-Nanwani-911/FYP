const generateRandomUsername = () => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  let length = 10;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};

const removePassword = (data) => {
  var updatedData = { ...data };
  delete data["password"];
  return updatedData;
};

const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

module.exports = {
  generateRandomUsername,
  removePassword,
  generateOtp,
};
