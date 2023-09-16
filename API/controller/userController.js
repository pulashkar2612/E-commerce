const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const userModel = require("../model/userModel");
const ordersModel = require("../model/ordersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");

const loginContoller = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  let checkUser = await userModel.find({ username: { $eq: username } });

  if (checkUser.length === 0) {
    res.status(400);
    throw new Error("User doesn't exist. Click on signup to create the user");
  } else {
    let passwordCheck = await bcrypt.compare(password, checkUser[0].password);
    if (!passwordCheck) {
      res.status(400);
      throw new Error("Incorrect Password");
    }
  }

  if (checkUser[0].sessionId.length >= 2) {
    res.status(400);
    throw new Error("You cannot login in more than two devices at a time.");
  }

  try {
    const token = await generateToken(checkUser[0]._id, checkUser[0].role);
    const refreshToken = await generateRefreshToken(
      checkUser[0]._id,
      checkUser[0].role
    );
    let userIdObject = new mongoose.Types.ObjectId(checkUser[0]._id);
    const sessionId = v4();
    await userModel.findByIdAndUpdate(userIdObject, {
      $addToSet: { sessionId: sessionId },
    });

    res.json({
      success: true,
      id: checkUser[0]._id,
      role: checkUser[0].role,
      username: username,
      token: token,
      refreshToken: refreshToken,
      sessionId: sessionId,
    });
  } catch (err) {
    next(err);
  }
});

const logoutContoller = asyncHandler(async (req, res, next) => {
  const { userId, sessionId } = req.body;

  if (!userId || !sessionId) {
    res.status(400);
    throw new Error("User Id or Session Id is missing");
  }

  try {
    const userIdObject = new mongoose.Types.ObjectId(userId);
    await userModel.findByIdAndUpdate(userIdObject, {
      $pull: { sessionId: sessionId },
    });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const userController = asyncHandler(async (req, res, next) => {
  try {
    const data = await userModel.find();
    res.send(data);
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const updateController = asyncHandler(async (req, res, next) => {
  const { id, username } = req.body;
  const allUsers = await userModel.find();
  const user = allUsers.find((e) => e.id === id);

  if (!user) {
    res.status(400);
    next({ message: "User not found" }, req, res);
  }

  try {
    await userModel.findByIdAndUpdate(id, { username });
    res.send("Record updated successfully");
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const deleteController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const allUsers = await userModel.find();
  const user = allUsers.find((e) => e.id === id);

  if (!user) {
    res.status(400);
    next({ message: "User not found" }, req, res);
  }

  try {
    await user.remove();
    res.send("Record deleted successfully");
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const addToCartController = asyncHandler(async (req, res, next) => {
  const { userId, productId } = req.body;

  const userIdObject = new mongoose.Types.ObjectId(userId);
  const productIdObject = new mongoose.Types.ObjectId(productId);

  const checkProductExisting = await userModel.find({
    $and: [
      { _id: { $eq: userIdObject } },
      { productId: { $elemMatch: { $in: productIdObject } } },
    ],
  });
  if (checkProductExisting && checkProductExisting.length) {
    res.status(400);
    throw new Error("Product is already added to cart.");
  }

  try {
    userModel.findByIdAndUpdate(
      userId,
      {
        $addToSet: { productId: productId },
      },
      function (err, doc) {
        if (err) {
          next(err, req, res);
        } else {
          res.json({
            success: true,
            cartLength: doc?.productId?.length + 1,
          });
        }
      }
    );
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const removeFromCartController = asyncHandler(async (req, res, next) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    res.status(400);
    throw new Error("user id or product id is missing");
  }

  try {
    let check = await userModel.findByIdAndUpdate(userId, {
      $pull: { productId: productId },
    });
    res.json({
      success: true,
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const getCartController = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User Id is missing!");
  }

  try {
    // const data = await userModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "productId",
    //       foreignField: "courseName",
    //       as: "cart",
    //     },
    //   },
    // ]);

    // const data = await userModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "products",
    //       let: {
    //         idFromUsersCollection: { $toObjectId: "$productId" },
    //       },
    //       pipeline: [
    //         {
    //           $match: { $expr: { $eq: ["$_id", "$$idFromUsersCollection"] } },
    //         },
    //       ],
    //       as: "cart",
    //     },
    //   },
    // ]);

    const userIdAsObject = new mongoose.Types.ObjectId(userId);
    const data = await userModel.aggregate([
      {
        $match: { $expr: { $eq: [userIdAsObject, "$_id"] } },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "cart",
        },
      },
      {
        $project: {
          cart: 1,
        },
      },
    ]);

    res.json({
      success: true,
      cart: data.length ? data[0].cart : [],
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const placeOrderController = asyncHandler(async (req, res, next) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    res.status(400);
    throw new Error("User Id or Product Id is missing");
  }

  try {
    const data = await ordersModel.create({
      userId: userId,
      productId: productId,
    });
    res.send({
      success: true,
      orderId: data?._id,
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const clearCartController = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User Id is missing");
  }

  try {
    const userIdObject = new mongoose.Types.ObjectId(userId);
    await userModel.findByIdAndUpdate(userIdObject, {
      productId: [],
    });
    res.send({
      success: true,
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const getOrdersController = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("User Id is missing");
  }

  try {
    const userIdObject = new mongoose.Types.ObjectId(userId);
    const data = await userModel.aggregate([
      {
        $match: { $expr: { $eq: [userIdObject, "$_id"] } },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "Orders",
        },
      },
      {
        $unwind: "$Orders",
      },
      {
        $lookup: {
          from: "products",
          localField: "Orders.productId",
          foreignField: "_id",
          as: "Products",
        },
      },
      {
        $project: {
          Products: 1,
        },
      },
    ]);
    res.json({
      success: true,
      products: data,
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

const refreshTokenContoller = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);
    throw new Error("Refresh Token is missing.");
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
      if (err) {
        res.status(401);
        next("Unauthorized - Refresh Token is expired.", req, res);
      } else {
        const { id, role } = user;
        const newToken = await generateToken(id, role);
        res.json({
          success: true,
          token: newToken,
        });
      }
    });
  } catch (err) {
    res.status(400);
    next(err, req, res);
  }
});

async function generateToken(id, role) {
  const token = jwt.sign(
    {
      id,
      role,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );

  return token;
}

// Refresh Token

async function generateRefreshToken(id, role) {
  const token = jwt.sign(
    {
      id,
      role,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "30m",
    }
  );

  return token;
}

module.exports = {
  userController,
  updateController,
  deleteController,
  loginContoller,
  addToCartController,
  removeFromCartController,
  getCartController,
  placeOrderController,
  clearCartController,
  getOrdersController,
  refreshTokenContoller,
  logoutContoller,
};
