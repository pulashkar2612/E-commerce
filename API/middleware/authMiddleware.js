const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const verifyTokenMiddleware = expressAsyncHandler(async (req, res, next) => {
  if (["/login", "/signup", "/refreshToken"].indexOf(req.url) > -1) {
    next();
  } else {
    if (req.headers.authorization && req.headers.authorization.split(" ")[1]) {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(403);
          throw new Error("Token is invalid");
        } else {
          req.body.userId = user.id;
          req.body.role = user.role;
          next();
        }
      });
    } else {
      res.status(401);
      throw new Error("Not authorized");
    }
  }
});

module.exports = verifyTokenMiddleware;
