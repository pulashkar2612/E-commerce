const express = require("express");
const router = express.Router();
const {
  addController,
  getController,
  updateController,
} = require("../controller/productController");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const verifyTokenMiddleware = require("../middleware/authMiddleware");

router.post("/addProduct", addController);
router.get("/getProducts", getController);
router.put(
  "/updateProduct",
  uploadMiddleware.single("image"),
  updateController
);

module.exports = router;
