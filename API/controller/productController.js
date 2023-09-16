const asyncHandler = require("express-async-handler");
const productModel = require("../model/productsModel");
const mongoose = require("mongoose");

const addController = asyncHandler(async (req, res, next) => {
  const { courseName, author, price, tags, isPublished } = req.body;

  let newProduct = new productModel({
    courseName: courseName,
    author: author,
    price: price,
    tags: tags,
    isPublished: isPublished,
  });

  try {
    await newProduct.validate();
    await productModel.create(newProduct);
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400);
    next(err);
  }
});

const getController = asyncHandler(async (req, res, next) => {
  let limitPerPage = parseInt(req.query.limitPerPage);
  let currentPage = parseInt(req.query.currentPage);

  let skip = 0;
  if (limitPerPage && currentPage) {
    skip = (currentPage - 1) * limitPerPage;
  }

  let query = {};
  if (req.query.role === "User") {
    query = {
      isPublished: true,
    };
  }

  try {
    let total = await productModel.find(query).count();
    let products = await productModel
      .find(query)
      .skip(skip)
      .limit(limitPerPage);
    res.json({
      success: true,
      totalNumberOfProducts: total,
      products: products,
      skip: skip,
    });
  } catch (err) {
    res.status(400);
    next(err);
  }
});

const updateController = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("ID is missing.");
  }
  try {
    const productIdObject = new mongoose.Types.ObjectId(id);
    await productModel.findByIdAndUpdate(productIdObject, {
      ...req.body,
      image: req.file ? req.file.filename : undefined,
    });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

// total number of products
// limit per page 3
// total/limit per page
// if i am in the second, first 3 products from the db should be skipped
// 2nd page, pageNo*limit items should be skipped

module.exports = { addController, getController, updateController };
