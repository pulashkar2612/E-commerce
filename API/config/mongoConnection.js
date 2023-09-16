const mongoose = require("mongoose");

const mongoDBConnection = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URL + "/ecommerce-app"
    );
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = mongoDBConnection;
