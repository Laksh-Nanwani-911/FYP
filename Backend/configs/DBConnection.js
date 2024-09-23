const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_DB_URI)
      .then((onConnect) => {
        console.log("Tech It Database Connection Established.");
      })
      .catch((onConnectError) => {
        console.log(
          "Tech It Database Connection NOT Established. ",
          onConnectError
        );
      });
  } catch (error) {
    console.log("Error while connecting to database: ", error);
  }
};

module.exports = {
  connectDB,
};
