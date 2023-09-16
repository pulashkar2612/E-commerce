const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productsSchema = new schema({
  courseName: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  },
});

const productsModel = mongoose.model("products", productsSchema);
module.exports = productsModel;
