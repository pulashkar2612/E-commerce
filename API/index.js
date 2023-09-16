const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const mongoDBConnection = require("./config/mongoConnection");
const verifyTokenMiddleware = require("./middleware/authMiddleware");

mongoDBConnection();

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(verifyTokenMiddleware);

// Routes
const signupRoute = require("./routes/signupRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
app.use("/", signupRoute);
app.use("/", userRoute);
app.use("/", productRoute);

// Custom Middleware
app.use(errorHandler);

// process.on("uncaughtException", (err) => {
//   console.log(err);
// });
// console.log(x);

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   process.exit(1);
// });

app.listen(process.env.PORT);
