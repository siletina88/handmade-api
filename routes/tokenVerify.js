const jwt = require("jsonwebtoken");

const tokenVerify = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid");
      req.user = user;
      next();
      return;
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

const tokenVerifyAndAuthorized = (req, res, next) => {
  tokenVerify(req, res, () => {
    if (req.body._id === req.params.id || req.user.isAdmin) {
      next();
      return;
    } else {
      console.log(req.body);
      return res.status(403).json("You are not allowed");
    }
  });
};
const tokenVerifyAndAdmin = (req, res, next) => {
  tokenVerify(req, res, () => {
    if (req.user?.isAdmin) {
      next();
      return;
    } else {
      return res.status(403).json("YOu are not allowed");
    }
  });
};
module.exports = { tokenVerify, tokenVerifyAndAuthorized, tokenVerifyAndAdmin };
