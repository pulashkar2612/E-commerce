const express = require("express");
const router = express.Router();
const {
  userController,
  updateController,
  deleteController,
  loginContoller,
  addToCartController,
  getCartController,
  placeOrderController,
  clearCartController,
  getOrdersController,
  refreshTokenContoller,
  removeFromCartController,
  logoutContoller,
} = require("../controller/userController");

router.post("/login", loginContoller);

router.post("/logout", logoutContoller);

router.get("/getAllUsers", userController);

router.patch("/updateUser", updateController);

router.delete("/deleteUser/:id", deleteController);

router.post("/addToCart", addToCartController);

router.post("/removeFromCart", removeFromCartController);

router.get("/getCartProducts", getCartController);

router.post("/placeOrder", placeOrderController);

router.get("/clearCart", clearCartController);

router.post("/getOrders", getOrdersController);

router.post("/refreshToken", refreshTokenContoller);

module.exports = router;
