const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    minLength: [8, "Username must be at least 8 characters"],
    required: true,
  },
  password: {
    type: String,
    minLength: [8, "Password must have 8 characters"],
    required: true,
    validate: [
      {
        validator: function (v) {
          return String(v).match(/\d/g);
        },
        message: "Password should have atleast one number",
      },
      {
        validator: function (v) {
          return String(v).match(/[a-zA-Z]/g);
        },
        message: "Password should have atlease one alphabet",
      },
      {
        validator: function (v) {
          return String(v).match(/[`!@#$%^&*().,]/g);
        },
        message: "Password should have atlease one special character",
      },
    ],
  },
  role: {
    type: String,
  },
  productId: {
    type: [mongoose.Types.ObjectId],
  },
  sessionId: [String],
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
